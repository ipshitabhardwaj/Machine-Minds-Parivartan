export const instant = false

import { connection } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Clock, Crown, Medal } from "lucide-react"
import type { LeaderboardEntry } from "@/types"
import { timeAgo } from "@/lib/utils"
import { getCompetitionState } from "@/lib/competition"
import { Podium } from "@/components/leaderboard-podium"
import { AutoRefresh } from "@/components/auto-refresh"

export default async function LeaderboardPage() {
  await connection()

  const profile = await requireAuth()
  const admin = createAdminClient()

  const state = await getCompetitionState()
  const ended = state.phase === "ended"
  // Freeze hides solves made after the freeze moment. Once the event has
  // ended the final, true standings are always shown.
  const isFrozen = state.frozen && !ended
  const cutoff = isFrozen && state.frozenAt ? new Date(state.frozenAt).getTime() : null

  const { data: allSolves } = await admin
    .from("solves")
    .select("team_id, points_awarded, is_first_blood, solved_at, teams(name)")

  const solves = (allSolves || []).filter(
    (s) => cutoff === null || new Date(s.solved_at).getTime() <= cutoff
  )

  const teamMap = new Map<
    string,
    {
      team_name: string
      total_points: number
      solves_count: number
      last_solve_time: string | null
      first_bloods: number
    }
  >()

  for (const s of solves || []) {
    const existing = teamMap.get(s.team_id) || {
      team_name: ((s.teams as unknown as { name: string }[] | null)?.[0]?.name) || "Unknown",
      total_points: 0,
      solves_count: 0,
      last_solve_time: null,
      first_bloods: 0,
    }

    existing.total_points += s.points_awarded
    existing.solves_count += 1
    existing.first_bloods += s.is_first_blood ? 1 : 0

    if (
      !existing.last_solve_time ||
      new Date(s.solved_at) > new Date(existing.last_solve_time)
    ) {
      existing.last_solve_time = s.solved_at
    }

    teamMap.set(s.team_id, existing)
  }

  const { data: allTeams } = await admin.from("teams").select("id, name")
  for (const t of allTeams || []) {
    if (!teamMap.has(t.id)) {
      teamMap.set(t.id, {
        team_name: t.name,
        total_points: 0,
        solves_count: 0,
        last_solve_time: null,
        first_bloods: 0,
      })
    }
  }

  // College comes from the team record
  const { data: teamRows } = await admin.from("teams").select("id, college")
  const collegeByTeam = new Map(
    (teamRows || []).map((t: { id: string; college: string | null }) => [t.id, t.college])
  )

  const leaderboard: (LeaderboardEntry & { college: string | null })[] = [...teamMap.entries()]
    .sort((a, b) => {
      if (b[1].total_points !== a[1].total_points) {
        return b[1].total_points - a[1].total_points
      }
      if (a[1].last_solve_time && b[1].last_solve_time) {
        return (
          new Date(a[1].last_solve_time).getTime() -
          new Date(b[1].last_solve_time).getTime()
        )
      }
      return 0
    })
    .map(([team_id, data], index) => ({
      rank: index + 1,
      team_id,
      college: collegeByTeam.get(team_id) ?? null,
      ...data,
    }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <AutoRefresh seconds={20} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">
            <Trophy className="h-6 w-6 text-[var(--accent)]" />
            Leaderboard
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1 font-mono">
            {">"} team rankings by total points
          </p>
        </div>
        {isFrozen && (
          <Badge variant="warning">Frozen</Badge>
        )}
      </div>

      {ended && (
        <Podium teams={leaderboard.filter((e) => e.total_points > 0).slice(0, 3)} />
      )}

      {isFrozen && (
        <div className="mb-4 border border-[var(--accent-yellow)]/40 bg-[var(--accent-yellow)]/5 px-4 py-2 font-mono text-xs text-[var(--accent-yellow)]">
          {">"} leaderboard frozen — standings are hidden until the final reveal
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="text-center py-20 border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <Trophy className="h-10 w-10 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-muted)] font-mono text-sm">
            {">"} No teams registered yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-2.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
            <div className="col-span-1">#</div>
            <div className="col-span-5 sm:col-span-4">Team</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right hidden sm:block">Solves</div>
            <div className="col-span-2 sm:col-span-3 text-right">Last Solve</div>
          </div>

          {leaderboard.map((entry) => {
            const isMyTeam = entry.team_id === profile.team_id
            const isTop3 = entry.rank <= 3
            return (
              <div
                key={entry.team_id}
                className={`grid grid-cols-12 gap-2 px-5 py-3.5 border text-sm items-center transition-colors ${
                  isMyTeam
                    ? "border-[var(--accent)]/30 bg-[var(--accent)]/5"
                    : isTop3
                    ? "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
                    : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <div className="col-span-1 font-mono font-black">
                  {entry.rank === 1 ? (
                    <Crown className="h-5 w-5 text-yellow-400" />
                  ) : entry.rank === 2 ? (
                    <Medal className="h-5 w-5 text-gray-300" />
                  ) : entry.rank === 3 ? (
                    <Medal className="h-5 w-5 text-orange-400" />
                  ) : (
                    <span className="text-[var(--text-muted)]">
                      {entry.rank}
                    </span>
                  )}
                </div>
                <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className={`block truncate font-bold ${isTop3 ? "text-[var(--text-primary)]" : ""}`}>
                      {entry.team_name}
                    </span>
                    {entry.college && (
                      <span className="block truncate text-[11px] text-[var(--text-muted)] font-normal">
                        {entry.college}
                      </span>
                    )}
                  </div>
                  {isMyTeam && (
                    <Badge variant="info" className="shrink-0">You</Badge>
                  )}
                  {entry.first_bloods > 0 && (
                    <span className="flex items-center gap-0.5 text-[var(--accent-coral)] shrink-0" title={`${entry.first_bloods} first blood(s)`}>
                      <Flame className="h-3 w-3" />
                      <span className="text-xs font-bold">{entry.first_bloods}</span>
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-right font-mono font-black text-[var(--accent)]">
                  {entry.total_points}
                </div>
                <div className="col-span-2 text-right hidden sm:block text-[var(--text-secondary)] font-mono">
                  {entry.solves_count}
                </div>
                <div className="col-span-2 sm:col-span-3 text-right text-[var(--text-muted)] text-xs flex items-center justify-end gap-1 font-mono">
                  {entry.last_solve_time ? (
                    <>
                      <Clock className="h-3 w-3" />
                      {timeAgo(entry.last_solve_time)}
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
