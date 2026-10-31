export const instant = false

import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TeamSection } from "@/components/dashboard/team-section"
import {
  Trophy,
  Flag,
  Hash,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react"
import type { CompetitionStatus } from "@/types"

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
    flag_format: map.flag_format || "MM{...}",
    max_team_size: parseInt(map.max_team_size || "4"),
    min_team_size: parseInt(map.min_team_size || "2"),
  }
}

export default async function DashboardPage() {
  const profile = await requireAuth()
  const admin = createAdminClient()
  const status = await getCompetitionStatus()

  let teamData = null
  let teamMembers: { user_id: string; profiles: { display_name: string; email: string }[] }[] = []
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

    const { data: members } = await admin
      .from("team_members")
      .select("user_id, profiles(display_name, email)")
      .eq("team_id", profile.team_id)
    teamMembers = (members || []) as typeof teamMembers

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

    // Calculate rank from solves
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome, {profile.display_name}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant={status.is_active ? "success" : "default"}>
            {status.is_active
              ? status.is_paused
                ? "Competition Paused"
                : "Competition Active"
              : "Competition Not Started"}
          </Badge>
          {status.end_time && (
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Ends: {new Date(status.end_time).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Team Section */}
      {!profile.team_id ? (
        <TeamSection maxTeamSize={status.max_team_size} />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--accent-green)]/10">
                  <Trophy className="h-5 w-5 text-[var(--accent-green)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{teamScore}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Total Points
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    #{teamRank || "—"}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">Rank</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Flag className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    {solveCount}/{totalChallenges || 0}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Solved
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Hash className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">
                    {totalChallenges || 0}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Info & Recent Solves */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardTitle className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-[var(--accent-green)]" />
                Team: {teamData?.name}
              </CardTitle>
              <CardContent>
                <div className="mb-4 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    Invite Code
                  </p>
                  <code className="text-[var(--accent-green)] font-mono text-lg">
                    {teamData?.invite_code}
                  </code>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  Members ({teamMembers.length}/{status.max_team_size})
                </p>
                <div className="space-y-2">
                  {teamMembers.map((m) => (
                    <div
                      key={m.user_id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-primary)] text-sm"
                    >
                      <span>{m.profiles?.[0]?.display_name}</span>
                      {m.user_id === teamData?.captain_id && (
                        <Badge variant="success">Captain</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="flex items-center gap-2 mb-4">
                <Flag className="h-5 w-5 text-purple-400" />
                Recent Solves
              </CardTitle>
              <CardContent>
                {recentSolves.length === 0 ? (
                  <p className="text-[var(--text-muted)] text-sm py-4 text-center">
                    No challenges solved yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentSolves.map((solve, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-primary)] text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span>{solve.challenge_title}</span>
                          {solve.is_first_blood && (
                            <Badge variant="danger">First Blood</Badge>
                          )}
                        </div>
                        <span className="text-[var(--accent-green)] font-mono">
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
