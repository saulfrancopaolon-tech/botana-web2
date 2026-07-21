import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'

// Sin 0, O, 1, I, L para que no se confundan al leerlos en voz alta
const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const TTL_SECONDS = 180 // 3 minutos

function generateCode(): string {
  let code = ''
  const bytes = crypto.randomBytes(CODE_LENGTH)
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[bytes[i] % CHARSET.length]
  }
  return code
}

export async function POST() {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let code = generateCode()

  // Por si acaso hay colisión con un código todavía activo (muy improbable)
  for (let attempts = 0; attempts < 5; attempts++) {
    const { data: existing } = await supabaseAdmin
      .from('codigos_canje')
      .select('id')
      .eq('code', code)
      .is('used_at', null)
      .maybeSingle()
    if (!existing) break
    code = generateCode()
  }

  const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString()

  const { data, error } = await supabaseAdmin
    .from('codigos_canje')
    .insert([{ code, expires_at: expiresAt }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ code: data.code, expiresAt: data.expires_at })
}
