import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'

export async function GET(req: Request) {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim().toLowerCase().replace(/@/g, '')

  // Sin busqueda: mostrar la lista completa de clientes (los mas activos
  // primero) para poder ojear/encontrar a alguien aunque no recuerdes
  // su usuario exacto de Instagram.
  if (q.length === 0) {
    const { data, error } = await supabaseAdmin
      .from('clientes_leales')
      .select('usuario_ig, puntos, is_verified')
      .order('puntos', { ascending: false })
      .order('usuario_ig', { ascending: true })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ customers: data, browsing: true })
  }

  const { data, error } = await supabaseAdmin
    .from('clientes_leales')
    .select('usuario_ig, puntos, is_verified')
    .ilike('usuario_ig', `%${q}%`)
    .order('usuario_ig', { ascending: true })
    .limit(25)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ customers: data, browsing: false })
}
