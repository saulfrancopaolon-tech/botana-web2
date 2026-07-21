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

  const { data: updated, error } = await supabaseAdmin
    .from('clientes_leales')
    .update({ puntos: 0 })
    .eq('usuario_ig', cleanUser)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ customer: updated })
}
