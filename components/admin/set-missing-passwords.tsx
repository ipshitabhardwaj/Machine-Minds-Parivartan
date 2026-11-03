"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setMissingPasswords } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export function SetMissingPasswords({ count }: { count: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function run() {
    setBusy(true)
    setMsg(null)
    const res = await setMissingPasswords()
    setBusy(false)
    if (res.error) setMsg(res.error)
    else {
      setMsg(`Set ${res.done} password(s).`)
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={run} disabled={busy}>
        {busy ? "Working..." : `Set missing passwords (${count})`}
      </Button>
      {msg && <span className="text-sm text-[var(--accent-coral)]">{msg}</span>}
    </div>
  )
}
