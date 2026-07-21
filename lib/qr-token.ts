import crypto from 'crypto'

// Sin 0, O, 1, I, L para evitar confusiones al leer/escribir el código a mano
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function randomCode(length: number): string {
  const bytes = crypto.randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return out
}

export function generateToken(): string {
  return `BOTA-${randomCode(5)}`
}

export const TOKEN_TTL_MS = 3 * 60 * 1000 // 3 minutos
