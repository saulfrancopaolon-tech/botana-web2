import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSessionToken, STAFF_COOKIE_NAME } from '@/lib/staff-session'

export async function POST(req: Request) {
  const staffPin = process.env.STAFF_PIN

  if (!staffPin) {
    return NextResponse.json(
      { error: 'El panel no está configurado todavía (falta STAFF_PIN).' },
      { status: 500 }
    )
  }

  let pin = ''
  try {
    const body = await req.json()
    pin = String(body?.pin || '')
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const givenBuf = Buffer.from(pin)
  const expectedBuf = Buffer.from(staffPin)

  const isValid =
    givenBuf.length === expectedBuf.length && crypto.timingSafeEqual(givenBuf, expectedBuf)

  if (!isValid) {
    return NextResponse.json({ error: 'PIN incorrecto.' }, { status: 401 })
  }

  const { token, maxAgeSeconds } = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(STAFF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  })
  return res
}
