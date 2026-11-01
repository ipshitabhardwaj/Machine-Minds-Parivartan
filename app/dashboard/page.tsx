export const instant = false

import { connection } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Flag,
  Hash,
  Clock,
  TrendingUp,
  Users,
  Flame,
} from "lucide-react"
import type { CompetitionStatus } from "@/types"
import { getCompetitionState } from "@/lib/competition"
import Link from "next/link"

async function getCompetitionStatus(): Promise<CompetitionStatus> {
  const admin = createAdminClient()
  const { data } = await admin.from("competition_settings").select("key, value")
  const map = Object.fromEntries(
    (data || []).map((s: { key: string; value: string }) => [s.key, s.value])
  )
  return {
    is_active: map.is_active === "true",
    is_paused: map.is_paused === "true",
    leaderboard_frozen: map.leaderboard_frozen === "true",
    start_time: map.start_time || null,
    end_time: map.end_time || null,
    competition_name: map.competition_name || "MACHINE MINDS",
    flag_format: map.flag_format || "flag{...}",
    max_team_size: parseInt(map.max_team_size || "4"),
    min_team_size: parseInt(map.min_team_size || "2"),
  }
}

export default async function DashboardPage() {
  await connection()

  const profile = await requireAuth()
  const admin = createAdminClient()
  const status = await getCompetitionStatus()
  const compState = await getCompetitionState()

  let teamData = null
  let teamScore = 0
  let solveCount = 0
  let teamRank = 0
  let recentSolves: { challenge_title: string; points: number; solved_at: string; is_first_blood: boolean }[] = []

  if (profile.team_id) {
    const { data: team } = await admin
      .from("teams")
      .select("*")
      .eq("id", profile.team_id)
      .single()
    teamData = team

    const { data: solves } = await admin
      .from("solves")
      .select("points_awarded, solved_at, is_first_blood, challenges(title)")
      .eq("team_id", profile.team_id)
      .order("solved_at", { ascending: false })

    solveCount = solves?.length || 0
    teamScore = (solves || []).reduce(
      (sum: number, s: { points_awarded: number }) => sum + s.points_awarded,
      0
    )

    recentSolves = (solves || []).slice(0, 5).map((s: { challenges: unknown; points_awarded: number; solved_at: string; is_first_blood: boolean }) => ({
      challenge_title: ((s.challenges as { title: string }[] | null)?.[0]?.title) || "Unknown",
      points: s.points_awarded,
      solved_at: s.solved_at,
      is_first_blood: s.is_first_blood,
    }))

    const { data: teamSolves } = await admin
      .from("solves")
      .select("team_id, points_awarded")
    const scores = new Map<string, number>()
    for (const s of teamSolves || []) {
      scores.set(s.team_id, (scores.get(s.team_id) || 0) + s.points_awarded)
    }
    const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1])
    teamRank = sorted.findIndex(([id]) => id === profile.team_id) + 1
  }

  const { count: totalChallenges } = await admin
    .from("challenges")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-black tracking-tight">
            Welcome, <span className="text-[var(--accent)]">{profile.display_name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={
              compState.phase === "live"
                ? "success"
                : compState.phase === "paused"
                  ? "warning"
                  : "default"
            }
          >
            {compState.phase === "live"
              ? "Competition Live"
              : compState.phase === "paused"
                ? "Paused"
                : compState.phase === "ended"
                  ? "Ended"
                  : "Not Started"}
          </Badge>
          {status.end_time && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3" />
              Ends: {new Date(status.end_time).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {compState.phase === "ended" && (
        <Link
          href="/leaderboard"
          className="block mb-6 border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-4 py-3 font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          {">"} The competition has ended — view the final results and top 3 →
        </Link>
      )}
      {compState.phase === "upcoming" && (
        <div className="mb-6 border border-[var(--border-hover)] bg-[var(--bg-card)] px-4 py-3 font-mono text-sm text-[var(--text-secondary)]">
          {">"} You are logged in. Challenges unlock when the organisers start the event.
        </div>
      )}

      {/* Team Section */}
      {!profile.team_id ? (
        profile.is_admin ? (
          <Card className="max-w-2xl">
            <CardTitle>You are logged in as an organiser</CardTitle>
            <CardContent className="mt-3 text-sm text-[var(--text-secondary)]">
              <p className="mb-4">
                This page is the team view, so it is empty for you. Run the event from the admin panel.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-sm">
                <Link href="/admin" className="bg-[var(--accent)] text-[#080c33] font-bold px-4 py-2 hover:bg-[var(--accent-bright)] transition-colors">
                  Open admin panel
                </Link>
                <Link href="/admin/import" className="border border-[var(--line)] px-4 py-2 hover:border-[var(--accent)] transition-colors">
                  Import teams
                </Link>
                <Link href="/admin/settings" className="border border-[var(--line)] px-4 py-2 hover:border-[var(--accent)] transition-colors">
                  Start or end the event
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-lg">
            <CardTitle>This login is not on a team</CardTitle>
            <CardContent className="mt-3 text-sm text-[var(--text-secondary)]">
              Teams are set up by the organisers. Ask at the desk for your team&apos;s Team ID and password.
            </CardContent>
          </Card>
        )
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            {[
              { icon: Trophy, label: "Total Points", value: teamScore, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
              { icon: TrendingUp, label: "Rank", value: `#${teamRank || "—"}`, color: "text-[var(--accent-blue)]", bg: "bg-[var(--accent-blue)]/10" },
              { icon: Flag, label: "Solved", value: `${solveCount}/${totalChallenges || 0}`, color: "text-[var(--accent-green)]", bg: "bg-[var(--accent-green)]/10" },
              { icon: Hash, label: "Available", value: totalChallenges || 0, color: "text-[var(--accent-yellow)]", bg: "bg-[var(--accent-yellow)]/10" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-3">
                  <div className={`p-2.5 ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-black font-mono">{stat.value}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Info & Recent Solves */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="flex items-center gap-2 mb-5">
                <Users className="h-5 w-5 text-[var(--accent)]" />
                Team: {teamData?.name}
              </CardTitle>
              <CardContent>
                <div className="mb-5 p-4 bg-[var(--bg-primary)] border border-[var(--border-primary)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Team ID</p>
                  <code className="text-[var(--accent)] font-mono text-2xl font-black tracking-wider">
                    {teamData?.team_code}
                  </code>
                  {teamData?.college && (
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{teamData.college}</p>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-2">Members</p>
                <div className="space-y-2">
                  {[teamData?.member1_name, teamData?.member2_name]
                    .filter(Boolean)
                    .map((name: string) => (
                      <div
                        key={name}
                        className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                        {name}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="flex items-center gap-2 mb-5">
                <Flag className="h-5 w-5 text-[var(--accent-green)]" />
                Recent Solves
              </CardTitle>
              <CardContent>
                {recentSolves.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] font-mono text-sm">
                      {">"} No challenges solved yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentSolves.map((solve, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{solve.challenge_title}</span>
                          {solve.is_first_blood && (
                            <span className="flex items-center gap-0.5 text-[var(--accent-coral)] shrink-0">
                              <Flame className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        <span className="text-[var(--accent)] font-mono font-bold shrink-0 ml-2">
                          +{solve.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
