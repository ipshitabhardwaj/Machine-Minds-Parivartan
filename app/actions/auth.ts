"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizeTeamCode } from "@/lib/team-accounts"

const loginSchema = z.object({
  identifier: z.string().trim().min(2, "Enter your Team ID"),
  password: z.string().min(4, "Enter your password"),
})

export async function login(
  _prevState: { error: string | null },
  formData: FormData
) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const invalid = { error: "Wrong Team ID or password" }
  let email = parsed.data.identifier
  let password = parsed.data.password

  if (!email.includes("@")) {
    // Team login: Team ID like MM-014. Generated passwords are uppercase, so
    // forgive caps-lock mistakes.
    const code = normalizeTeamCode(email)
    if (!code) return { error: "Team IDs look like MM-014" }
    const { data: team } = await createAdminClient()
      .from("teams")
      .select("login_email")
      .eq("team_code", code)
      .single()
    if (!team?.login_email) return invalid
    email = team.login_email
    password = password.replace(/\s+/g, "").toUpperCase()
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === "invalid_credentials") return invalid
    return { error: error.message }
  }

  const redirectTo = formData.get("redirect") as string
  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard")
}
