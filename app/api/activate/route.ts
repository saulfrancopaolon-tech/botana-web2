import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Activa (o crea) la BOTA-Card del cliente. Corre en el servidor con la
// service role key, asi que SIEMPRE puede escribir en la tabla sin
// depender de que las politicas RLS permitan escritura anonima desde
// el navegador (que es justo lo que fallaba antes en silencio).
export async function POST(req: Request) {
  let usuarioIg = ''
  try {
    const body = await req.json()
    usuarioIg = String(body?.usuario_ig || '')
  } catch {
    return NextResponse.json({ error: 'Solicitud invalida.' }, { status: 400 })
  }

  const cleanUser = usuarioIg.trim().toLowerCase().replace(/^@/, '')
  if (!cleanUser || cleanUser.length < 3) {
    return NextResponse.json({ error: 'Usuario de Instagram invalido.' }, { status: 400 })
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('clientes_leales')
    .select('*')
    .eq('usuario_ig', cleanUser)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (existing) {
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('clientes_leales')
      .update({ is_verified: true })
      .eq('usuario_ig', cleanUser)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    return NextResponse.json({ customer: updated })
  }

  const { data: created, error: createError } = await supabaseAdmin
    .from('clientes_leales')
    .insert([{ usuario_ig: cleanUser, puntos: 0, is_verified: true }])
    .select()
    .single()

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }
  return NextResponse.json({ customer: created, created: true })
}
