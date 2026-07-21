import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'
import { generateToken, TOKEN_TTL_MS } from '@/lib/qr-token'

export async function POST() {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let token = generateToken()

  // Nos aseguramos de no chocar con un token existente (extremadamente
  // improbable, pero por las dudas reintentamos hasta 5 veces)
  for (let attempts = 0; attempts < 5; attempts++) {
    const { data: existing } = await supabaseAdmin
      .from('qr_tokens')
      .select('token')
      .eq('token', token)
      .maybeSingle()
    if (!existing) break
    token = generateToken()
  }

  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString()

  const { error } = await supabaseAdmin.from('qr_tokens').insert([{ token, expires_at: expiresAt }])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ token, expiresAt })
}
