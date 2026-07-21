import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const MESSAGES: Record<string, string> = {
  not_found: 'Ese código no existe o ya expiró.',
  already_used: 'Ese código ya fue usado.',
  expired: 'Ese código ya expiró, pide uno nuevo.',
  card_full: 'Tu tarjeta ya está llena (10/10). ¡Ve por tu premio!',
  invalid_user: 'Falta tu usuario de Instagram.',
}

export async function POST(req: Request) {
  let code = ''
  let usuarioIg = ''
  try {
    const body = await req.json()
    code = String(body?.code || '').trim().toUpperCase()
    usuarioIg = String(body?.usuario_ig || '').trim()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  if (!code || code.length < 4) {
    return NextResponse.json({ error: 'Código inválido.' }, { status: 400 })
  }

  // Pequeña fricción para dificultar intentos automatizados de adivinar el código
  await new Promise((resolve) => setTimeout(resolve, 300))

  const { data, error } = await supabaseAdmin.rpc('redeem_code', {
    p_code: code,
    p_usuario: usuarioIg,
  })

  if (error) {
    return NextResponse.json({ error: 'No se pudo canjear el código.' }, { status: 500 })
  }

  const result = Array.isArray(data) ? data[0] : data
  const status = result?.status

  if (status !== 'ok') {
    return NextResponse.json(
      { error: MESSAGES[status] || 'No se pudo canjear el código.' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    puntos: result.puntos,
    created: result.created,
    message: '¡Punto agregado! 🎉',
  })
}
