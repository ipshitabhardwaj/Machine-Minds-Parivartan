"use client"

import { toggleChallenge, deleteChallenge } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Trash2 } from "lucide-react"
import { useState } from "react"

interface Props {
  challengeId: string
  isActive: boolean
}

export function AdminChallengeActions({ challengeId, isActive }: Props) {
  const [confirming, setConfirming] = useState(false)

  async function handleToggle() {
    await toggleChallenge(challengeId, !isActive)
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    await deleteChallenge(challengeId)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleToggle}>
        {isActive ? (
          <>
            <EyeOff className="h-4 w-4" /> Hide
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" /> Show
          </>
        )}
      </Button>
      <Button
        variant={confirming ? "danger" : "ghost"}
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
        {confirming ? "Confirm?" : "Delete"}
      </Button>
      {confirming && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      )}
    </div>
  )
}
