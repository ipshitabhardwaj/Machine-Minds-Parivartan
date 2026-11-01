export const instant = false

import { ImportTeams } from "@/components/admin/import-teams"
import { Upload } from "lucide-react"

export default function AdminImportPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Upload className="h-6 w-6 text-[var(--accent)]" />
        Import teams
      </h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
        Upload the registered-students sheet or paste it from Excel. Each team
        gets one login: a Team ID like MM-014 and a generated password. Download
        the credentials list straight after importing, because passwords are
        shown only once.
      </p>
      <ImportTeams />
    </div>
  )
}
