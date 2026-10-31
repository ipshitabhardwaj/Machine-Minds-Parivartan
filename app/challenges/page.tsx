export const instant = false

import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { ChallengeGrid } from "@/components/challenges/challenge-grid"
import type { Challenge } from "@/types"

export default async function ChallengesPage() {
  const profile = await requireAuth()
  const admin = createAdminClient()

  const { data: challenges } = await admin
    .from("challenges")
    .select("id, title, category, difficulty, points, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  let solvedIds: string[] = []
  const firstBloods: Record<string, string> = {}

  if (profile.team_id) {
    const { data: solves } = await admin
      .from("solves")
      .select("challenge_id")
      .eq("team_id", profile.team_id)
    solvedIds = (solves || []).map((s: { challenge_id: string }) => s.challenge_id)
  }

  // Get first bloods
  const { data: allFirstBloods } = await admin
    .from("solves")
    .select("challenge_id, teams(name)")
    .eq("is_first_blood", true)

  for (const fb of allFirstBloods || []) {
    const teamArr = fb.teams as unknown as { name: string }[] | null
    firstBloods[fb.challenge_id] = teamArr?.[0]?.name || ""
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Solve challenges to earn points for your team
        </p>
      </div>

      <ChallengeGrid
        challenges={(challenges || []) as Pick<Challenge, "id" | "title" | "category" | "difficulty" | "points" | "is_active">[]}
        solvedIds={solvedIds}
        firstBloods={firstBloods}
        hasTeam={!!profile.team_id}
      />
    </div>
  )
}
