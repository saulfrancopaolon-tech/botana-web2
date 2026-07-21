import { NextResponse } from 'next/server'
import { isStaffAuthed } from '@/lib/staff-session'

export async function GET() {
  return NextResponse.json({ authed: await isStaffAuthed() })
}
