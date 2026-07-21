-- Ejecuta esto UNA VEZ en Supabase: Dashboard -> SQL Editor -> New query -> pega y RUN.
-- Objetivo: que el navegador del cliente (llave "anon") ya NO pueda modificar
-- la columna "puntos" bajo ninguna circunstancia. Solo el panel /staff
-- (que usa la service_role key, en el servidor) podrá cambiar puntos.

-- 1. Activar seguridad a nivel de fila (RLS)
alter table public.clientes_leales enable row level security;

-- 2. Limpiar políticas anteriores si existían, para evitar duplicados
drop policy if exists "clientes_leales_select_anon" on public.clientes_leales;
drop policy if exists "clientes_leales_insert_anon" on public.clientes_leales;
drop policy if exists "clientes_leales_update_anon" on public.clientes_leales;

-- 3. El público puede LEER cualquier fila (para ver su propio saldo de puntos)
create policy "clientes_leales_select_anon"
on public.clientes_leales for select
to anon
using (true);

-- 4. El público puede crear su propio registro la primera vez que entra,
--    siempre y cuando empiece en 0 puntos (evita crear cuentas ya "cargadas")
create policy "clientes_leales_insert_anon"
on public.clientes_leales for insert
to anon
with check (puntos = 0);

-- 5. El público puede actualizar su fila (para marcar is_verified),
--    pero el permiso de columna del paso 6 evita que toque "puntos"
create policy "clientes_leales_update_anon"
on public.clientes_leales for update
to anon
using (true)
with check (true);

-- 6. Permisos por columna: el rol "anon" pierde permiso de UPDATE sobre
--    toda la tabla, y se le regresa SOLO para la columna is_verified.
--    Así, aunque alguien abra la consola del navegador e intente hacer
--    supabase.from('clientes_leales').update({ puntos: 999 }), Postgres
--    lo va a rechazar.
revoke update on public.clientes_leales from anon;
grant select, insert on public.clientes_leales to anon;
grant update (is_verified) on public.clientes_leales to anon;

-- Nota: el rol "service_role" (el que usa /app/api/staff/*) se salta RLS
-- por defecto en Supabase, así que no necesita política adicional.


-- =====================================================================
-- PARTE 2: Códigos de canje de un solo uso (QR + código corto)
-- =====================================================================
-- Cada código: lo genera el panel /staff, dura 3 minutos, y solo se
-- puede usar UNA vez. Sirve tanto para el QR como para el código corto
-- que puedes decirle al cliente si no puede escanear.

create table if not exists public.codigos_canje (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by text
);

-- RLS activo y SIN políticas para "anon": esto significa que el
-- navegador del cliente no puede leer ni escribir esta tabla directamente,
-- solo puede hacerlo a través de la función redeem_code de abajo.
alter table public.codigos_canje enable row level security;

-- Función que canjea un código de forma atómica (a prueba de dos
-- escaneos al mismo tiempo) y sube el punto al cliente correspondiente.
create or replace function public.redeem_code(p_code text, p_usuario text)
returns table(status text, puntos int, created boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code record;
  v_customer record;
  v_clean_user text := lower(trim(replace(coalesce(p_usuario, ''), '@', '')));
  v_new_points int;
  v_created boolean := false;
begin
  if v_clean_user is null or length(v_clean_user) < 3 then
    return query select 'invalid_user'::text, 0, false;
    return;
  end if;

  select * into v_code from public.codigos_canje
    where code = upper(p_code)
    for update;

  if v_code is null then
    return query select 'not_found'::text, 0, false;
    return;
  end if;

  if v_code.used_at is not null then
    return query select 'already_used'::text, 0, false;
    return;
  end if;

  if v_code.expires_at < now() then
    return query select 'expired'::text, 0, false;
    return;
  end if;

  select * into v_customer from public.clientes_leales where usuario_ig = v_clean_user for update;

  if v_customer is not null and v_customer.puntos >= 10 then
    return query select 'card_full'::text, v_customer.puntos, false;
    return;
  end if;

  -- Solo se "quema" el código si de verdad vamos a sumar el punto
  update public.codigos_canje
    set used_at = now(), used_by = v_clean_user
    where id = v_code.id;

  if v_customer is null then
    insert into public.clientes_leales (usuario_ig, puntos, is_verified)
    values (v_clean_user, 1, false)
    returning puntos into v_new_points;
    v_created := true;
  else
    update public.clientes_leales
      set puntos = v_customer.puntos + 1
      where usuario_ig = v_clean_user
      returning puntos into v_new_points;
  end if;

  return query select 'ok'::text, v_new_points, v_created;
end;
$$;

-- Solo el backend (service_role) puede ejecutar esta función
revoke all on function public.redeem_code(text, text) from public;
grant execute on function public.redeem_code(text, text) to service_role;
