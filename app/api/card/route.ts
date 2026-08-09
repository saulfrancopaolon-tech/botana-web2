import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Lee los puntos/estado del cliente desde el servidor, para no depender
// de que la tabla permita SELECT anonimo desde el navegador.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const usuario = (searchParams.get('usuario_ig') || '').trim().toLowerCase().replace(/^@/, '')

  if (!usuario) {
    return NextResponse.json({ error: 'Falta usuario_ig' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('clientes_leales')
    .select('puntos, is_verified')
    .eq('usuario_ig', usuario)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ customer: data })
}
