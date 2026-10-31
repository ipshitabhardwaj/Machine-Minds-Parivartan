"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createHash } from "crypto"
import { z } from "zod"

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
  category: z.enum(["web", "crypto", "forensics", "osint", "reverse", "ai"]),
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
