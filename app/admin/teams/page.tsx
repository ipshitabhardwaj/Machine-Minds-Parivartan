export const instant = false

import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Users } from "lucide-react"

export default async function AdminTeamsPage() {
  const admin = createAdminClient()

  const { data: teams } = await admin
    .from("teams")
    .select("*, profiles!teams_captain_id_fkey(display_name)")
    .order("created_at", { ascending: false })

  const { data: memberCounts } = await admin
    .from("team_members")
    .select("team_id")

  const countMap = new Map<string, number>()
  for (const m of memberCounts || []) {
    countMap.set(m.team_id, (countMap.get(m.team_id) || 0) + 1)
  }

  // Get solve counts per team
  const { data: solveCounts } = await admin.from("solves").select("team_id")
  const solveMap = new Map<string, number>()
  for (const s of solveCounts || []) {
    solveMap.set(s.team_id, (solveMap.get(s.team_id) || 0) + 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-purple-400" />
        Teams ({teams?.length || 0})
      </h1>

      <div className="space-y-3">
        {(teams || []).map((team) => (
          <div
            key={team.id}
            className="p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div>
                <h3 className="font-medium">{team.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] mt-1">
                  <span>
                    Captain: {((team.profiles as unknown as { display_name: string }[] | null)?.[0]?.display_name) || "Unknown"}
                  </span>
                  <span>&middot;</span>
                  <span>Code: <code className="text-[var(--accent-green)]">{team.invite_code}</code></span>
                  <span>&middot;</span>
                  <span>Created: {formatDate(team.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">
                  {countMap.get(team.id) || 0} members
                </Badge>
                <Badge variant="success">
                  {solveMap.get(team.id) || 0} solves
                </Badge>
              </div>
            </div>
          </div>
        ))}

        {(!teams || teams.length === 0) && (
          <p className="text-center py-12 text-[var(--text-muted)]">
            No teams registered yet.
          </p>
        )}
      </div>
    </div>
  )
}
