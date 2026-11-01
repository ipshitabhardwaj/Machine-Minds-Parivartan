"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createHash } from "crypto"
import { z } from "zod"
import { randomBytes } from "crypto"
import {
  generatePassword,
  formatTeamCode,
  loginEmailFor,
} from "@/lib/team-accounts"

function hashFlag(flag: string): string {
  return createHash("sha256").update(flag.trim()).digest("hex")
}

async function requireAdminAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  const admin = await isAdmin(user.id)
  if (!admin) throw new Error("Not authorized")
  return user.id
}

const challengeSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  description: z.string().min(1, "Description required"),
  category: z.enum(["web", "crypto", "forensics", "osint", "misc"]),
  difficulty: z.enum(["easy", "medium", "hard", "expert"]),
  points: z.coerce.number().int().positive("Points must be positive"),
  flag: z.string().min(1, "Flag required"),
  hint: z.string().optional(),
  hintPenalty: z.coerce.number().int().min(0).default(0),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(false),
})

export async function createChallenge(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized", success: false }
  }

  const parsed = challengeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    difficulty: formData.get("difficulty"),
    points: formData.get("points"),
    flag: formData.get("flag"),
    hint: formData.get("hint"),
    hintPenalty: formData.get("hintPenalty"),
    attachmentUrl: formData.get("attachmentUrl"),
    isActive: formData.get("isActive") === "on",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const admin = createAdminClient()
  const { error } = await admin.from("challenges").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    points: parsed.data.points,
    flag_hash: hashFlag(parsed.data.flag),
    hint: parsed.data.hint || null,
    hint_penalty: parsed.data.hintPenalty,
    attachment_url: parsed.data.attachmentUrl || null,
    is_active: parsed.data.isActive,
  })

  if (error) {
    return { error: "Failed to create challenge", success: false }
  }

  revalidatePath("/admin/challenges")
  revalidatePath("/challenges")
  return { error: null, success: true }
}

export async function updateChallenge(
  challengeId: string,
  _prevState: { error: string | null; success: boolean },
  formData: FormData
) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized", success: false }
  }

  const flag = formData.get("flag") as string
  const parsed = challengeSchema
    .extend({ flag: z.string().optional() })
    .safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      points: formData.get("points"),
      flag: flag || undefined,
      hint: formData.get("hint"),
      hintPenalty: formData.get("hintPenalty"),
      attachmentUrl: formData.get("attachmentUrl"),
      isActive: formData.get("isActive") === "on",
    })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const admin = createAdminClient()
  const updateData: Record<string, unknown> = {
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    difficulty: parsed.data.difficulty,
    points: parsed.data.points,
    hint: parsed.data.hint || null,
    hint_penalty: parsed.data.hintPenalty,
    attachment_url: parsed.data.attachmentUrl || null,
    is_active: parsed.data.isActive,
  }

  if (flag) {
    updateData.flag_hash = hashFlag(flag)
  }

  const { error } = await admin
    .from("challenges")
    .update(updateData)
    .eq("id", challengeId)

  if (error) {
    return { error: "Failed to update challenge", success: false }
  }

  revalidatePath("/admin/challenges")
  revalidatePath("/challenges")
  return { error: null, success: true }
}

export async function deleteChallenge(challengeId: string) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("challenges")
    .delete()
    .eq("id", challengeId)

  if (error) {
    return { error: "Failed to delete challenge" }
  }

  revalidatePath("/admin/challenges")
  revalidatePath("/challenges")
  return { error: null }
}

export async function toggleChallenge(
  challengeId: string,
  isActive: boolean
) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }

  const admin = createAdminClient()
  await admin
    .from("challenges")
    .update({ is_active: isActive })
    .eq("id", challengeId)

  revalidatePath("/admin/challenges")
  revalidatePath("/challenges")
  return { error: null }
}

export async function updateCompetitionSetting(key: string, value: string) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }

  const admin = createAdminClient()
  await admin
    .from("competition_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)

  revalidatePath("/admin/settings")
  revalidatePath("/dashboard")
  revalidatePath("/challenges")
  revalidatePath("/leaderboard")
  return { error: null }
}


async function writeSettings(pairs: Record<string, string>) {
  const admin = createAdminClient()
  const now = new Date().toISOString()
  const rows = Object.entries(pairs).map(([key, value]) => ({
    key,
    value,
    updated_at: now,
  }))
  const { error } = await admin
    .from("competition_settings")
    .upsert(rows, { onConflict: "key" })

  revalidatePath("/admin/settings")
  revalidatePath("/dashboard")
  revalidatePath("/challenges")
  revalidatePath("/leaderboard")
  return { error: error ? "Failed to update settings" : null }
}

export async function startCompetition() {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }
  return writeSettings({
    is_active: "true",
    is_paused: "false",
    is_ended: "false",
    start_time: new Date().toISOString(),
  })
}

export async function endCompetition() {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }
  return writeSettings({
    is_ended: "true",
    is_paused: "false",
    leaderboard_frozen: "false",
    frozen_at: "",
  })
}

export async function setLeaderboardFrozen(frozen: boolean) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }
  return writeSettings({
    leaderboard_frozen: frozen ? "true" : "false",
    frozen_at: frozen ? new Date().toISOString() : "",
  })
}


// ───────────── Team accounts (provisioned by organisers) ─────────────

const teamRowSchema = z.object({
  teamName: z.string().trim().max(40).default(""),
  member1: z.string().trim().min(1, "Member 1 name is required").max(80),
  member2: z.string().trim().min(1, "Member 2 name is required").max(80),
  college: z.string().trim().max(80).default(""),
  email1: z.string().trim().max(120).default(""),
  email2: z.string().trim().max(120).default(""),
})

export interface CreatedTeam {
  ok: boolean
  error?: string
  code?: string
  password?: string
  teamName: string
  member1: string
  member2: string
  college: string
}

async function requireAdminWithEmail() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  if (!(await isAdmin(user.id))) throw new Error("Not authorized")
  return user.email || ""
}

/** Create up to 15 teams (each: one login account, one team, two named members). */
export async function createTeamsBatch(
  rowsInput: unknown
): Promise<{ error: string | null; results: CreatedTeam[] }> {
  let adminEmail: string
  try {
    adminEmail = await requireAdminWithEmail()
  } catch {
    return { error: "Not authorized", results: [] }
  }

  const parsed = z.array(teamRowSchema).min(1).max(15).safeParse(rowsInput)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, results: [] }
  }

  const baseEmail = process.env.TEAM_EMAIL_BASE || adminEmail
  if (!baseEmail.includes("@")) {
    return { error: "No base email available for team logins", results: [] }
  }

  const admin = createAdminClient()

  // Next free team number
  const { data: last } = await admin
    .from("teams")
    .select("team_code")
    .not("team_code", "is", null)
    .order("team_code", { ascending: false })
    .limit(1)
  let next = last?.[0]?.team_code
    ? parseInt(String(last[0].team_code).replace(/\D/g, ""), 10) + 1
    : 1

  const results: CreatedTeam[] = []
  for (const row of parsed.data) {
    const base = {
      teamName: row.teamName,
      member1: row.member1,
      member2: row.member2,
      college: row.college,
    }
    const code = formatTeamCode(next)
    const password = generatePassword()
    const email = loginEmailFor(code, baseEmail)
    const teamName = row.teamName || `Team ${String(next).padStart(3, "0")}`

    const { data: created, error: userErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { provisioned: true },
      user_metadata: { display_name: teamName, college: row.college },
    })
    if (userErr || !created.user) {
      results.push({ ...base, ok: false, error: userErr?.message || "Could not create login" })
      continue
    }
    const userId = created.user.id

    let finalName = teamName
    let teamId: string | null = null
    for (let attempt = 0; attempt < 2 && !teamId; attempt++) {
      const { data: team, error: teamErr } = await admin
        .from("teams")
        .insert({
          name: finalName,
          invite_code: randomBytes(4).toString("hex").toUpperCase(),
          captain_id: userId,
          team_code: code,
          member1_name: row.member1,
          member2_name: row.member2,
          member1_email: row.email1 || null,
          member2_email: row.email2 || null,
          college: row.college || null,
          login_email: email,
        })
        .select("id")
        .single()
      if (team) teamId = team.id
      else if (teamErr?.code === "23505" && attempt === 0) finalName = `${teamName} (${code})`
      else break
    }
    if (!teamId) {
      await admin.auth.admin.deleteUser(userId)
      results.push({ ...base, ok: false, error: "Could not save the team (duplicate name or ID?)" })
      continue
    }

    await admin.from("team_members").insert({ team_id: teamId, user_id: userId })
    await admin.from("profiles").upsert({
      id: userId,
      email,
      display_name: finalName,
      college: row.college || null,
      team_id: teamId,
    })

    results.push({ ...base, teamName: finalName, ok: true, code, password })
    next += 1
  }

  revalidatePath("/admin/teams")
  revalidatePath("/admin")
  revalidatePath("/leaderboard")
  return { error: null, results }
}

export async function resetTeamPassword(teamId: string) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized", password: null, code: null }
  }
  const admin = createAdminClient()
  const { data: team } = await admin
    .from("teams")
    .select("captain_id, team_code")
    .eq("id", teamId)
    .single()
  if (!team) return { error: "Team not found", password: null, code: null }

  const password = generatePassword()
  const { error } = await admin.auth.admin.updateUserById(team.captain_id, { password })
  if (error) return { error: "Could not reset the password", password: null, code: null }
  return { error: null, password, code: team.team_code as string | null }
}

export async function deleteTeam(teamId: string) {
  try {
    await requireAdminAction()
  } catch {
    return { error: "Not authorized" }
  }
  const admin = createAdminClient()
  const { data: team } = await admin
    .from("teams")
    .select("captain_id")
    .eq("id", teamId)
    .single()
  if (!team) return { error: "Team not found" }

  await admin.from("profiles").update({ team_id: null }).eq("team_id", teamId)
  await admin.from("teams").delete().eq("id", teamId)
  await admin.auth.admin.deleteUser(team.captain_id)

  revalidatePath("/admin/teams")
  revalidatePath("/admin")
  revalidatePath("/leaderboard")
  return { error: null }
}
