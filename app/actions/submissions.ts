"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { createHash } from "crypto"

function hashFlag(flag: string): string {
  return createHash("sha256").update(flag.trim()).digest("hex")
}

export async function submitFlag(
  _prevState: {
    error: string | null
    success: boolean
    message: string | null
  },
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated", success: false, message: null }
  }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()

  if (!profile?.team_id) {
    return {
      error: "You must be in a team to submit flags",
      success: false,
      message: null,
    }
  }

  const challengeId = formData.get("challengeId") as string
  const flag = (formData.get("flag") as string)?.trim()

  if (!challengeId || !flag) {
    return { error: "Missing challenge ID or flag", success: false, message: null }
  }

  // Check competition status
  const { data: settings } = await admin
    .from("competition_settings")
    .select("key, value")
    .in("key", ["is_active", "is_paused"])

  const settingsMap = Object.fromEntries(
    (settings || []).map((s: { key: string; value: string }) => [s.key, s.value])
  )

  if (settingsMap.is_active !== "true") {
    return {
      error: "The competition is not active",
      success: false,
      message: null,
    }
  }

  if (settingsMap.is_paused === "true") {
    return {
      error: "Submissions are currently paused",
      success: false,
      message: null,
    }
  }

  // Check if already solved by this team
  const { data: existingSolve } = await admin
    .from("solves")
    .select("id")
    .eq("challenge_id", challengeId)
    .eq("team_id", profile.team_id)
    .single()

  if (existingSolve) {
    return {
      error: null,
      success: false,
      message: "Your team has already solved this challenge",
    }
  }

  // Rate limit: check last submission time
  const { data: lastSubmission } = await admin
    .from("submissions")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (lastSubmission) {
    const { data: cooldownSetting } = await admin
      .from("competition_settings")
      .select("value")
      .eq("key", "submission_cooldown_seconds")
      .single()

    const cooldown = parseInt(cooldownSetting?.value || "10")
    const lastTime = new Date(lastSubmission.created_at).getTime()
    const now = Date.now()

    if (now - lastTime < cooldown * 1000) {
      const waitSecs = Math.ceil((cooldown * 1000 - (now - lastTime)) / 1000)
      return {
        error: `Please wait ${waitSecs} seconds before submitting again`,
        success: false,
        message: null,
      }
    }
  }

  // Get challenge and validate flag
  const { data: challenge } = await admin
    .from("challenges")
    .select("id, flag_hash, points, is_active")
    .eq("id", challengeId)
    .single()

  if (!challenge || !challenge.is_active) {
    return { error: "Challenge not found", success: false, message: null }
  }

  const submittedHash = hashFlag(flag)
  const isCorrect = submittedHash === challenge.flag_hash

  // Record submission
  await admin.from("submissions").insert({
    challenge_id: challengeId,
    team_id: profile.team_id,
    user_id: user.id,
    submitted_flag: flag,
    is_correct: isCorrect,
  })

  if (!isCorrect) {
    return { error: "Incorrect flag", success: false, message: null }
  }

  // Check for first blood
  const { count: existingSolves } = await admin
    .from("solves")
    .select("*", { count: "exact", head: true })
    .eq("challenge_id", challengeId)

  const isFirstBlood = (existingSolves || 0) === 0

  // Check for hint penalty
  const { data: hintUnlock } = await admin
    .from("hint_unlocks")
    .select("id")
    .eq("challenge_id", challengeId)
    .eq("team_id", profile.team_id)
    .single()

  let pointsAwarded = challenge.points
  if (hintUnlock) {
    const { data: challengeFull } = await admin
      .from("challenges")
      .select("hint_penalty")
      .eq("id", challengeId)
      .single()
    pointsAwarded = Math.max(0, challenge.points - (challengeFull?.hint_penalty || 0))
  }

  // Insert solve (unique constraint prevents duplicates)
  const { error: solveError } = await admin.from("solves").insert({
    challenge_id: challengeId,
    team_id: profile.team_id,
    user_id: user.id,
    points_awarded: pointsAwarded,
    is_first_blood: isFirstBlood,
  })

  if (solveError) {
    if (solveError.code === "23505") {
      return {
        error: null,
        success: false,
        message: "Your team has already solved this challenge",
      }
    }
    return { error: "Failed to record solve", success: false, message: null }
  }

  revalidatePath("/challenges")
  revalidatePath("/dashboard")
  revalidatePath("/leaderboard")

  return {
    error: null,
    success: true,
    message: isFirstBlood
      ? `Correct! First blood! +${pointsAwarded} points`
      : `Correct! +${pointsAwarded} points`,
  }
}

export async function unlockHint(challengeId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated", hint: null }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()

  if (!profile?.team_id) {
    return { error: "You must be in a team", hint: null }
  }

  const { data: challenge } = await admin
    .from("challenges")
    .select("hint, hint_penalty")
    .eq("id", challengeId)
    .single()

  if (!challenge?.hint) {
    return { error: "No hint available", hint: null }
  }

  // Upsert hint unlock (idempotent)
  await admin.from("hint_unlocks").upsert(
    { challenge_id: challengeId, team_id: profile.team_id },
    { onConflict: "challenge_id,team_id" }
  )

  revalidatePath(`/challenges/${challengeId}`)

  return {
    error: null,
    hint: challenge.hint,
    penalty: challenge.hint_penalty,
  }
}
