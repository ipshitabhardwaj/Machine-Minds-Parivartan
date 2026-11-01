export const instant = false

import { connection } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { AdminSettingsForm } from "@/components/admin/settings-form"
import { Settings } from "lucide-react"
import { getCompetitionState } from "@/lib/competition"

export default async function AdminSettingsPage() {
  await connection()

  const admin = createAdminClient()

  const { data: settings } = await admin
    .from("competition_settings")
    .select("key, value")

  const state = await getCompetitionState()

  const settingsMap = Object.fromEntries(
    (settings || []).map((s: { key: string; value: string }) => [s.key, s.value])
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6 text-[var(--accent-coral)]" />
        Competition Settings
      </h1>

      <AdminSettingsForm settings={settingsMap} phase={state.phase} />
    </div>
  )
}
