import { randomInt } from "crypto"

// Unambiguous characters only (no I, O, 0, 1): easy to read off a printed slip.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generatePassword(length = 8): string {
  let out = ""
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)]
  return out
}

export function formatTeamCode(n: number): string {
  return `MM-${String(n).padStart(3, "0")}`
}

/** "mm14", "MM-014", " mm 014 " -> "MM-014". Returns null if it is not a Team ID. */
export function normalizeTeamCode(input: string): string | null {
  const m = input.trim().toUpperCase().replace(/\s+/g, "").match(/^MM-?(\d{1,4})$/)
  return m ? formatTeamCode(parseInt(m[1], 10)) : null
}

/**
 * Supabase Auth needs an email. Team accounts use plus-addressing on a real
 * mailbox you control (you+mm014@gmail.com). Plus-addressing keeps every
 * address unique and valid, and no email is ever sent to it.
 */
export function loginEmailFor(code: string, baseEmail: string): string {
  const [local, domain] = baseEmail.trim().toLowerCase().split("@")
  const clean = local.split("+")[0]
  return `${clean}+${code.toLowerCase().replace("-", "")}@${domain}`
}
