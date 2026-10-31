"use client"

import { useState } from "react"
import { unlockHint } from "@/app/actions/submissions"
import { Button } from "@/components/ui/button"
import { Lightbulb, AlertTriangle } from "lucide-react"

interface Props {
  challengeId: string
  hintPenalty: number
  initialUnlocked: boolean
  hint: string | null
}

export function HintButton({
  challengeId,
  hintPenalty,
  initialUnlocked,
  hint: initialHint,
}: Props) {
  const [unlocked, setUnlocked] = useState(initialUnlocked)
  const [hint, setHint] = useState(initialHint)
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUnlock() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    setLoading(true)
    const result = await unlockHint(challengeId)
    setLoading(false)

    if (result.hint) {
      setHint(result.hint)
      setUnlocked(true)
      setConfirming(false)
    }
  }

  if (unlocked && hint) {
    return (
      <div className="p-4 rounded-lg border border-yellow-800/50 bg-yellow-950/20">
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-2">
          <Lightbulb className="h-4 w-4" />
          Hint
          {hintPenalty > 0 && (
            <span className="text-yellow-600">(-{hintPenalty} pts)</span>
          )}
        </div>
        <p className="text-[var(--text-secondary)] text-sm">{hint}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleUnlock}
        disabled={loading}
      >
        <Lightbulb className="h-4 w-4" />
        {confirming ? "Confirm unlock?" : "Show Hint"}
      </Button>
      {confirming && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-yellow-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {hintPenalty > 0
              ? `This will cost ${hintPenalty} points`
              : "No penalty"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
