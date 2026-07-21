import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'

export async function GET(req: Request) {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const token = (searchParams.get('token') || '').trim().toUpperCase()
  if (!token) {
    return NextResponse.json({ error: 'Falta el token' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('qr_tokens')
    .select('used, used_by, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ found: false })
  }

  return NextResponse.json({
    found: true,
    used: data.used,
    used_by: data.used_by,
    expiresAt: data.expires_at,
  })
}
