import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isStaffAuthed } from '@/lib/staff-session'

export async function GET(req: Request) {
  if (!(await isStaffAuthed())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || '').trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Falta código' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('codigos_canje')
    .select('code, used_at, used_by, expires_at')
    .eq('code', code)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    used: Boolean(data.used_at),
    used_by: data.used_by,
    expired: new Date(data.expires_at) < new Date(),
  })
}
