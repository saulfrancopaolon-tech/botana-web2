import crypto from 'crypto'
import { cookies } from 'next/headers'

export const STAFF_COOKIE_NAME = 'botana_staff_session'
const SESSION_HOURS = 12

function getSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET
  if (!secret) {
    throw new Error('Falta STAFF_SESSION_SECRET en las variables de entorno')
  }
  return secret
}

/**
 * Crea un token firmado (HMAC) que guarda solo la fecha de expiración.
 * No contiene el PIN ni ningún dato sensible, así que es seguro guardarlo
 * en una cookie httpOnly.
 */
export function createSessionToken(): { token: string; maxAgeSeconds: number } {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000
  const payload = String(expiresAt)
  const hmac = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return { token: `${payload}.${hmac}`, maxAgeSeconds: SESSION_HOURS * 60 * 60 }
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, hmac] = token.split('.')
  if (!payload || !hmac) return false

  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  const expectedBuf = Buffer.from(expected, 'hex')
  const givenBuf = Buffer.from(hmac, 'hex')

  if (expectedBuf.length !== givenBuf.length) return false
  if (!crypto.timingSafeEqual(expectedBuf, givenBuf)) return false

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}

/** Helper para usar dentro de rutas API (app/api/staff/*) */
export async function isStaffAuthed(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(STAFF_COOKIE_NAME)?.value
  return verifySessionToken(token)
}
