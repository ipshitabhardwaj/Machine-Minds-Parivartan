import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { cache } from "react"
import type { Profile } from "@/types"

export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
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
  const profile = await requireAuth()
  const admin = await createAdminClient()
  const { data } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", profile.id)
    .single()

  if (!data?.is_admin) redirect("/dashboard")
  return { ...profile, is_admin: true }
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
