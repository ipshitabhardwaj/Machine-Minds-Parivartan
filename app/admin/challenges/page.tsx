export const instant = false

import { connection } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/types"
import { AdminChallengeActions } from "@/components/admin/challenge-actions"
import { AdminChallengeForm } from "@/components/admin/challenge-form"
import type { ChallengeCategory, ChallengeDifficulty } from "@/types"

export default async function AdminChallengesPage() {
  await connection()

  const admin = createAdminClient()

  const { data: challenges } = await admin
    .from("challenges")
    .select("*")
    .order("sort_order", { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Challenges</h1>
        <AdminChallengeForm />
      </div>

      <div className="space-y-3">
        {(challenges || []).map((c) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{c.title}</h3>
                <Badge variant={c.is_active ? "success" : "default"}>
                  {c.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <span>{CATEGORY_LABELS[c.category as ChallengeCategory]}</span>
                <span>&middot;</span>
                <span>{DIFFICULTY_LABELS[c.difficulty as ChallengeDifficulty]}</span>
                <span>&middot;</span>
                <span className="text-[var(--accent-green)]">
                  {c.points} pts
                </span>
              </div>
            </div>
            <AdminChallengeActions
              challengeId={c.id}
              isActive={c.is_active}
            />
          </div>
        ))}

        {(!challenges || challenges.length === 0) && (
          <p className="text-center py-12 text-[var(--text-muted)]">
            No challenges created yet.
          </p>
        )}
      </div>
    </div>
  )
}
