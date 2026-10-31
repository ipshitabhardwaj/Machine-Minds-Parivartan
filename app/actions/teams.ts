"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateInviteCode } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(30, "Team name must be at most 30 characters")
    .regex(/^[a-zA-Z0-9\s_-]+$/, "Team name can only contain letters, numbers, spaces, hyphens and underscores"),
})

const joinTeamSchema = z.object({
  inviteCode: z.string().length(8, "Invite code must be 8 characters"),
})

export async function createTeam(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated", success: false }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()

  if (profile?.team_id) {
    return { error: "You are already in a team", success: false }
  }

  const parsed = createTeamSchema.safeParse({
    name: formData.get("name"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const inviteCode = generateInviteCode()

  const { data: team, error: teamError } = await admin
    .from("teams")
    .insert({
      name: parsed.data.name,
      invite_code: inviteCode,
      captain_id: user.id,
    })
    .select()
    .single()

  if (teamError) {
    if (teamError.code === "23505") {
      return { error: "A team with this name already exists", success: false }
    }
    return { error: "Failed to create team", success: false }
  }

  await admin
    .from("team_members")
    .insert({ team_id: team.id, user_id: user.id })

  await admin
    .from("profiles")
    .update({ team_id: team.id })
    .eq("id", user.id)

  revalidatePath("/dashboard")
  return { error: null, success: true }
}

export async function joinTeam(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated", success: false }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()

  if (profile?.team_id) {
    return { error: "You are already in a team", success: false }
  }

  const parsed = joinTeamSchema.safeParse({
    inviteCode: (formData.get("inviteCode") as string)?.toUpperCase(),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const { data: team } = await admin
    .from("teams")
    .select("id")
    .eq("invite_code", parsed.data.inviteCode)
    .single()

  if (!team) {
    return { error: "Invalid invite code", success: false }
  }

  const { data: settings } = await admin
    .from("competition_settings")
    .select("value")
    .eq("key", "max_team_size")
    .single()

  const maxSize = parseInt(settings?.value || "4")

  const { count } = await admin
    .from("team_members")
    .select("*", { count: "exact", head: true })
    .eq("team_id", team.id)

  if ((count || 0) >= maxSize) {
    return { error: "This team is full", success: false }
  }

  const { error: joinError } = await admin
    .from("team_members")
    .insert({ team_id: team.id, user_id: user.id })

  if (joinError) {
    if (joinError.code === "23505") {
      return { error: "You are already in a team", success: false }
    }
    return { error: "Failed to join team", success: false }
  }

  await admin
    .from("profiles")
    .update({ team_id: team.id })
    .eq("id", user.id)

  revalidatePath("/dashboard")
  return { error: null, success: true }
}
