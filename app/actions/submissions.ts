"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { createHash } from "crypto"
import { getCompetitionState } from "@/lib/competition"

function hashFlag(flag: string): string {
  return createHash("sha256").update(flag.trim()).digest("hex")
}

type SubmitState = {
  error: string | null
  success: boolean
  message: string | null
}

const fail = (error: string): SubmitState => ({ error, success: false, message: null })
const note = (message: string): SubmitState => ({ error: null, success: false, message })

export async function submitFlag(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const user = await getUser()
  if (!user) return fail("Not authenticated")

  const challengeId = formData.get("challengeId") as string
  const flag = (formData.get("flag") as string)?.trim()
  if (!challengeId || !flag) return fail("Missing challenge ID or flag")

  const admin = createAdminClient()

  // Independent lookups run together instead of one after another.
  const [{ data: profile }, state] = await Promise.all([
    admin.from("profiles").select("team_id").eq("id", user.id).single(),
    getCompetitionState(),
  ])

  if (!profile?.team_id) return fail("You must be in a team to submit flags")
  const teamId = profile.team_id as string

  // Competition status (server-side source of truth)
  if (state.phase === "upcoming") return fail("The competition has not started yet")
  if (state.phase === "ended") return fail("The competition has ended")
  if (state.phase === "paused") return fail("Submissions are currently paused")

  const [{ data: existingSolve }, { data: lastSubmission }, { data: challenge }] =
    await Promise.all([
      admin
        .from("solves")
        .select("id")
        .eq("challenge_id", challengeId)
        .eq("team_id", teamId)
        .maybeSingle(),
      admin
        .from("submissions")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("challenges")
        .select("id, flag_hash, points, is_active, hint_penalty")
        .eq("id", challengeId)
        .maybeSingle(),
    ])

  if (existingSolve) return note("Your team has already solved this challenge")

  // Rate limit (cooldown value comes with the competition state, no extra query)
  if (lastSubmission) {
    const cooldown = parseInt(state.settings.submission_cooldown_seconds || "10")
    const elapsed = Date.now() - new Date(lastSubmission.created_at).getTime()
    if (elapsed < cooldown * 1000) {
      const waitSecs = Math.ceil((cooldown * 1000 - elapsed) / 1000)
      return fail(`Please wait ${waitSecs} seconds before submitting again`)
    }
  }

  if (!challenge || !challenge.is_active) return fail("Challenge not found")

  const isCorrect = hashFlag(flag) === challenge.flag_hash

  if (!isCorrect) {
    await admin.from("submissions").insert({
      challenge_id: challengeId,
      team_id: teamId,
      user_id: user.id,
      submitted_flag: flag,
      is_correct: false,
    })
    return fail("Incorrect flag")
  }

  const [, { count: existingSolves }, { data: hintUnlock }] = await Promise.all([
    admin.from("submissions").insert({
      challenge_id: challengeId,
      team_id: teamId,
      user_id: user.id,
      submitted_flag: flag,
      is_correct: true,
    }),
    admin
      .from("solves")
      .select("*", { count: "exact", head: true })
      .eq("challenge_id", challengeId),
    admin
      .from("hint_unlocks")
      .select("id")
      .eq("challenge_id", challengeId)
      .eq("team_id", teamId)
      .maybeSingle(),
  ])

  const isFirstBlood = (existingSolves || 0) === 0
  const pointsAwarded = hintUnlock
    ? Math.max(0, challenge.points - (challenge.hint_penalty || 0))
    : challenge.points

  // Unique constraint (challenge_id, team_id) prevents double scoring
  const { error: solveError } = await admin.from("solves").insert({
    challenge_id: challengeId,
    team_id: teamId,
    user_id: user.id,
    points_awarded: pointsAwarded,
    is_first_blood: isFirstBlood,
  })

  if (solveError) {
    if (solveError.code === "23505") {
      return note("Your team has already solved this challenge")
    }
    return fail("Failed to record solve")
  }

  revalidatePath("/challenges")
  revalidatePath("/dashboard")

  return {
    error: null,
    success: true,
    message: isFirstBlood
      ? `Correct! First blood! +${pointsAwarded} points`
      : `Correct! +${pointsAwarded} points`,
  }
}

export async function unlockHint(challengeId: string) {
  const user = await getUser()
  if (!user) return { error: "Not authenticated", hint: null }

  const admin = createAdminClient()

  const [{ data: profile }, hintState, { data: challenge }] = await Promise.all([
    admin.from("profiles").select("team_id").eq("id", user.id).single(),
    getCompetitionState(),
    admin
      .from("challenges")
      .select("hint, hint_penalty")
      .eq("id", challengeId)
      .maybeSingle(),
  ])

  if (!profile?.team_id) return { error: "You must be in a team", hint: null }

  if (hintState.phase !== "live" && hintState.phase !== "paused") {
    return { error: "The competition is not running", hint: null }
  }

  if (!challenge?.hint) return { error: "No hint available", hint: null }

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
