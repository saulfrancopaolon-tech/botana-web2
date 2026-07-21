import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'

export async function POST(req: Request) {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let usuarioIg = ''
  try {
    const body = await req.json()
    usuarioIg = String(body?.usuario_ig || '')
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const cleanUser = usuarioIg.trim().toLowerCase().replace('@', '')
  if (!cleanUser || cleanUser.length < 3) {
    return NextResponse.json({ error: 'Usuario de Instagram inválido.' }, { status: 400 })
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('clientes_leales')
    .select('*')
    .eq('usuario_ig', cleanUser)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  // Cliente nuevo: se crea con 1 punto de una vez
  if (!existing) {
    const { data: created, error: createError } = await supabaseAdmin
      .from('clientes_leales')
      .insert([{ usuario_ig: cleanUser, puntos: 1, is_verified: false }])
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
    return NextResponse.json({ customer: created, created: true })
  }

  if (existing.puntos >= 10) {
    return NextResponse.json(
      { error: `La tarjeta de @${cleanUser} ya está llena (10/10).` },
      { status: 400 }
    )
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('clientes_leales')
    .update({ puntos: existing.puntos + 1 })
    .eq('usuario_ig', cleanUser)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ customer: updated })
}
