import { cacheLife } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Raw standings data shared by the leaderboard and every team's dashboard rank.
 * Cached for a few seconds so 70+ teams polling don't each hit the database:
 * the DB sees roughly one read per 5 seconds instead of one per page view.
 */
export async function getStandingsData() {
  "use cache"
  cacheLife({ stale: 5, revalidate: 5, expire: 60 })

  const admin = createAdminClient()
  const [solvesRes, teamsRes] = await Promise.all([
    admin
      .from("solves")
      .select("team_id, points_awarded, is_first_blood, solved_at"),
    admin.from("teams").select("id, name, college"),
  ])

  return {
    solves: (solvesRes.data ?? []) as {
      team_id: string
      points_awarded: number
      is_first_blood: boolean
      solved_at: string
    }[],
    teams: (teamsRes.data ?? []) as {
      id: string
      name: string
      college: string | null
    }[],
  }
}
