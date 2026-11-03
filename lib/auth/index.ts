import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { cache } from "react"
import type { Profile } from "@/types"

/**
 * Reads the signed-in user from the session cookie. getClaims() verifies the
 * JWT locally (no network round-trip to Supabase Auth), which removes ~100ms+
 * from every page load. The proxy still refreshes expiring sessions.
 */
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const c = data?.claims
  if (!c?.sub) return null
  return { id: c.sub as string, email: (c.email as string | undefined) ?? null }
})

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  return profile
})

export async function requireAuth(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) redirect("/login")
  return profile
}

export async function requireAdmin(): Promise<Profile> {
  // Profile is read with the service role, so is_admin is authoritative.
  const profile = await requireAuth()
  if (!profile.is_admin) redirect("/dashboard")
  return profile
}

export async function isAdmin(userId: string): Promise<boolean> {
  const admin = await createAdminClient()
  const { data } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single()
  return data?.is_admin === true
}
