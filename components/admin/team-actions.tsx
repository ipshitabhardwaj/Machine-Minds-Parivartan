"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { resetTeamPassword, deleteTeam } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export function TeamActions({ teamId, teamName }: { teamId: string; teamName: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [shown, setShown] = useState<string | null>(null)

  async function reset() {
    if (!confirm(`Reset the password for ${teamName}? The old password stops working.`)) return
    setBusy(true)
    const res = await resetTeamPassword(teamId)
    setBusy(false)
    if (res.error) alert(res.error)
    else setShown(`${res.code}  ${res.password}`)
  }

  async function remove() {
    if (!confirm(`Delete ${teamName}? This removes its login, solves and submissions and cannot be undone.`)) return
    setBusy(true)
    const res = await deleteTeam(teamId)
    setBusy(false)
    if (res.error) alert(res.error)
    else router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={reset} disabled={busy}>
          Reset password
        </Button>
        <Button size="sm" variant="danger" onClick={remove} disabled={busy}>
          Delete
        </Button>
      </div>
      {shown && (
        <p className="font-mono text-sm border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-3 py-1">
          New login: <strong>{shown}</strong>
        </p>
      )}
    </div>
  )
}
