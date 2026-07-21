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
  if (!cleanUser) {
    return NextResponse.json({ error: 'Usuario inválido.' }, { status: 400 })
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('clientes_leales')
    .select('*')
    .eq('usuario_ig', cleanUser)
    .maybeSingle()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }
  if (!existing) {
    return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 })
  }

  const newPoints = Math.max(0, existing.puntos - 1)

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('clientes_leales')
    .update({ puntos: newPoints })
    .eq('usuario_ig', cleanUser)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ customer: updated })
}
