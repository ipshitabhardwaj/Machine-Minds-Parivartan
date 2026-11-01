"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Radio } from "lucide-react"

function fmt(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(t / 86400)
  const h = Math.floor((t % 86400) / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s)}`
}

/**
 * Shown instead of challenges until the admin starts the event.
 * Re-checks with the server every 8s, so the page unlocks by itself.
 */
export function WaitingRoom({ startTime }: { startTime: string | null }) {
  const router = useRouter()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0)
    const tick = setInterval(() => setNow(Date.now()), 1000)
    const poll = setInterval(() => router.refresh(), 8000)
    return () => {
      clearTimeout(first)
      clearInterval(tick)
      clearInterval(poll)
    }
  }, [router])

  const target = startTime ? new Date(startTime).getTime() : null
  const scheduled = target !== null && now !== null && target > now

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="cyber-panel p-10 sm:p-14">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[var(--accent)]/40 bg-[var(--accent)]/5 glow-soft">
          <Lock className="h-7 w-7 text-[var(--accent)]" />
        </div>
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--accent)] mb-3">
          {">"} ARENA_LOCKED
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
          The competition hasn&apos;t started
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">
          Challenges stay hidden until an organiser starts the event. Keep this
          page open — it unlocks automatically.
        </p>

        {scheduled ? (
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--text-muted)] mb-2">
              SCHEDULED START IN
            </p>
            <p className="font-mono text-4xl sm:text-5xl font-black text-[var(--accent)] glow-text tabular-nums">
              {fmt((target as number) - now)}
            </p>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-coral)]">
            <Radio className="h-4 w-4 animate-pulse" />
            waiting for organisers to start
            <span className="animate-blink">_</span>
          </div>
        )}
      </div>
    </div>
  )
}
