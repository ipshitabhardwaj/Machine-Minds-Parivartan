export const instant = false

import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { FileText, CheckCircle, XCircle } from "lucide-react"

export default async function AdminSubmissionsPage() {
  const admin = createAdminClient()

  const { data: submissions } = await admin
    .from("submissions")
    .select("*, challenges(title), profiles(display_name), teams(name)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-yellow-400" />
        Recent Submissions
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-primary)]">
              <th className="pb-3 pr-4">Time</th>
              <th className="pb-3 pr-4">Team</th>
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Challenge</th>
              <th className="pb-3 pr-4">Flag</th>
              <th className="pb-3">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {(submissions || []).map((s) => (
              <tr key={s.id} className="text-[var(--text-secondary)]">
                <td className="py-3 pr-4 text-xs whitespace-nowrap">
                  {formatDate(s.created_at)}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {((s.teams as unknown as { name: string }[] | null)?.[0]?.name) || "—"}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {((s.profiles as unknown as { display_name: string }[] | null)?.[0]?.display_name) || "—"}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {((s.challenges as unknown as { title: string }[] | null)?.[0]?.title) || "—"}
                </td>
                <td className="py-3 pr-4 font-mono text-xs max-w-[200px] truncate">
                  {s.submitted_flag}
                </td>
                <td className="py-3">
                  {s.is_correct ? (
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="danger">
                      <XCircle className="h-3 w-3 mr-1" />
                      Wrong
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!submissions || submissions.length === 0) && (
          <p className="text-center py-12 text-[var(--text-muted)]">
            No submissions yet.
          </p>
        )}
      </div>
    </div>
  )
}
