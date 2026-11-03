export const instant = false

import { connection } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { TeamActions } from "@/components/admin/team-actions"
import { Users, Printer } from "lucide-react"
import Link from "next/link"
import { SetMissingPasswords } from "@/components/admin/set-missing-passwords"

export default async function AdminTeamsPage() {
  await connection()

  const admin = createAdminClient()

  const { data: teams } = await admin
    .from("teams")
    .select("id, name, team_code, member1_name, member2_name, college, login_password, created_at")
    .order("team_code", { ascending: true })

  const { data: solveCounts } = await admin.from("solves").select("team_id")
  const solveMap = new Map<string, number>()
  for (const s of solveCounts || []) {
    solveMap.set(s.team_id, (solveMap.get(s.team_id) || 0) + 1)
  }

  const missingCount = (teams || []).filter((t) => !t.login_password).length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-[var(--accent)]" />
          Teams ({teams?.length || 0})
        </h1>
        {missingCount > 0 && <SetMissingPasswords count={missingCount} />}
        {teams && teams.length > 0 && (
          <Link
            href="/admin/slips"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--accent)] text-[var(--accent)] text-sm font-bold hover:bg-[var(--accent)] hover:text-[var(--bg-primary)]"
          >
            <Printer className="h-4 w-4" />
            Credential slips
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {(teams || []).map((team) => (
          <div key={team.id} className="p-4 border border-[var(--border-primary)] bg-[var(--bg-card)]">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[var(--accent)]">{team.team_code || "no ID"}</span>
                  <h3 className="font-bold truncate">{team.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {[team.member1_name, team.member2_name].filter(Boolean).join(" and ") || "No members listed"}
                  {team.college ? `, ${team.college}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-mono text-sm border border-[var(--border-primary)] px-3 py-1">
                  <span className="text-[var(--text-muted)]">ID </span>
                  <strong>{team.team_code || "-"}</strong>
                  <span className="text-[var(--text-muted)]"> &nbsp;PASS </span>
                  {team.login_password ? (
                    <strong className="text-[var(--accent)] select-all">{team.login_password}</strong>
                  ) : (
                    <span className="text-[var(--text-muted)]">not saved, use Reset</span>
                  )}
                </div>
                <Badge variant="success">{solveMap.get(team.id) || 0} solves</Badge>
                <TeamActions teamId={team.id} teamName={team.name} />
              </div>
            </div>
          </div>
        ))}

        {(!teams || teams.length === 0) && (
          <p className="text-center py-12 text-[var(--text-muted)]">
            No teams yet. Use Import teams to add them.
          </p>
        )}
      </div>
    </div>
  )
}
