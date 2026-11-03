"use client"

import { useEffect, useState } from "react"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlipTeam {
  id: string
  name: string
  code: string
  member1: string
  member2: string
  college: string
  password: string
}

/** Printable credential slips, 8 per A4 page. Print, or choose "Save as PDF". */
export function Slips({ teams }: { teams: SlipTeam[] }) {
  const [origin, setOrigin] = useState("")
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const missing = teams.filter((t) => !t.password).length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="no-print mb-6 space-y-2">
        <h1 className="text-2xl font-bold">Credential slips ({teams.length})</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Click the button, then print them or pick &quot;Save as PDF&quot; as the printer.
          Cut along the dashed lines and hand one slip to each team.
        </p>
        {missing > 0 && (
          <p className="text-sm text-[var(--accent-coral)]">
            {missing} team(s) have no saved password (created before this feature). Use
            Reset password on the Teams page, then reload this page.
          </p>
        )}
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      <div className="slip-grid grid grid-cols-2">
        {teams.map((t) => (
          <div key={t.id} className="slip">
            <div className="slip-head">MACHINE MINDS · PARIVARTAN 2026</div>
            <div className="slip-team">{t.name}</div>
            <div className="slip-row">
              <span>TEAM ID</span>
              <strong>{t.code || "-"}</strong>
            </div>
            <div className="slip-row">
              <span>PASSWORD</span>
              <strong>{t.password || "ask organiser"}</strong>
            </div>
            <div className="slip-small">
              {[t.member1, t.member2].filter(Boolean).join(" & ")}
              {t.college ? ` · ${t.college}` : ""}
            </div>
            <div className="slip-small">
              Log in at {origin || "the event website"}/login with your Team ID and
              password. Flags look like flag&#123;...&#125;. Keep this slip private.
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
