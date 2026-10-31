export const instant = false

import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { Trophy, Flame, Clock } from "lucide-react"
import type { LeaderboardEntry } from "@/types"
import { timeAgo } from "@/lib/utils"

export default async function LeaderboardPage() {
  const profile = await requireAuth()
  const admin = createAdminClient()

  // Check if leaderboard is frozen
  const { data: frozenSetting } = await admin
    .from("competition_settings")
    .select("value")
    .eq("key", "leaderboard_frozen")
    .single()

  const isFrozen = frozenSetting?.value === "true"

  // Build leaderboard from solves
  const { data: solves } = await admin
    .from("solves")
    .select("team_id, points_awarded, is_first_blood, solved_at, teams(name)")

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

  // Also include teams with 0 solves
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

  // Sort: by points desc, then by last solve time asc (earlier is better)
  const leaderboard: LeaderboardEntry[] = [...teamMap.entries()]
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
      ...data,
    }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[var(--accent-green)]" />
            Leaderboard
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Team rankings by total points
          </p>
        </div>
        {isFrozen && (
          <Badge variant="warning">Leaderboard Frozen</Badge>
        )}
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          No teams registered yet.
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5 sm:col-span-4">Team</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right hidden sm:block">Solves</div>
            <div className="col-span-2 sm:col-span-3 text-right">Last Solve</div>
          </div>

          {leaderboard.map((entry) => {
            const isMyTeam = entry.team_id === profile.team_id
            return (
              <div
                key={entry.team_id}
                className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg border text-sm items-center ${
                  isMyTeam
                    ? "border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5"
                    : "border-[var(--border-primary)] bg-[var(--bg-card)]"
                } ${entry.rank <= 3 ? "font-medium" : ""}`}
              >
                <div className="col-span-1">
                  {entry.rank === 1 ? (
                    <span className="text-yellow-400 font-bold">1</span>
                  ) : entry.rank === 2 ? (
                    <span className="text-gray-300 font-bold">2</span>
                  ) : entry.rank === 3 ? (
                    <span className="text-orange-400 font-bold">3</span>
                  ) : (
                    <span className="text-[var(--text-muted)]">
                      {entry.rank}
                    </span>
                  )}
                </div>
                <div className="col-span-5 sm:col-span-4 flex items-center gap-2 min-w-0">
                  <span className="truncate">
                    {entry.team_name}
                  </span>
                  {isMyTeam && (
                    <Badge variant="success" className="shrink-0">You</Badge>
                  )}
                  {entry.first_bloods > 0 && (
                    <span className="flex items-center gap-0.5 text-[var(--accent-coral)] shrink-0" title={`${entry.first_bloods} first blood(s)`}>
                      <Flame className="h-3 w-3" />
                      <span className="text-xs">{entry.first_bloods}</span>
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-right font-mono text-[var(--accent-green)]">
                  {entry.total_points}
                </div>
                <div className="col-span-2 text-right hidden sm:block text-[var(--text-secondary)]">
                  {entry.solves_count}
                </div>
                <div className="col-span-2 sm:col-span-3 text-right text-[var(--text-muted)] text-xs flex items-center justify-end gap-1">
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
