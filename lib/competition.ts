import { connection } from "next/server"
import { cache } from "react"
import { createAdminClient } from "@/lib/supabase/admin"

export type CompetitionPhase = "upcoming" | "live" | "paused" | "ended"

export interface CompetitionState {
  phase: CompetitionPhase
  startTime: string | null
  endTime: string | null
  frozen: boolean
  frozenAt: string | null
  teamsLocked: boolean
  maxTeamSize: number
  settings: Record<string, string>
}

function parseTime(v: string | undefined): Date | null {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Single source of truth for the event lifecycle. Everything server-side
 * (challenge visibility, flag submission, team changes, leaderboard) must go
 * through this, never through client state.
 *
 *  upcoming : admin has not started it (or a scheduled start is in the future)
 *  live     : running
 *  paused   : admin paused submissions
 *  ended    : admin ended it, or end_time has passed
 */
export const getCompetitionState = cache(async (): Promise<CompetitionState> => {
  // The phase depends on the current time, so it must be computed per request.
  await connection()
  const admin = createAdminClient()
  const { data } = await admin.from("competition_settings").select("key, value")
  const s: Record<string, string> = Object.fromEntries(
    (data || []).map((r: { key: string; value: string }) => [r.key, r.value])
  )

  const now = new Date()
  const start = parseTime(s.start_time)
  const end = parseTime(s.end_time)

  let phase: CompetitionPhase
  if (s.is_ended === "true") phase = "ended"
  else if (s.is_active !== "true") phase = "upcoming"
  else if (start && now < start) phase = "upcoming"
  else if (end && now >= end) phase = "ended"
  else if (s.is_paused === "true") phase = "paused"
  else phase = "live"

  return {
    phase,
    startTime: start ? start.toISOString() : null,
    endTime: end ? end.toISOString() : null,
    frozen: s.leaderboard_frozen === "true",
    frozenAt: s.frozen_at || null,
    teamsLocked: s.teams_locked === "true" || phase === "ended",
    maxTeamSize: parseInt(s.max_team_size || "4"),
    settings: s,
  }
})
