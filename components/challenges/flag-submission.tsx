"use client"

import { useActionState } from "react"
import { submitFlag } from "@/app/actions/submissions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Send } from "lucide-react"

export function FlagSubmission({ challengeId }: { challengeId: string }) {
  const [state, formAction, pending] = useActionState(submitFlag, {
    error: null as string | null,
    success: false,
    message: null as string | null,
  })

  return (
    <div className="p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
        Submit Flag
      </h3>

      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm mb-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      {state.message && !state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-950/50 border border-yellow-900 text-yellow-400 text-sm mb-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      {state.success && state.message && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-950/50 border border-green-900 text-green-400 text-sm mb-3">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      {!state.success && (
        <form action={formAction} className="flex gap-2">
          <input type="hidden" name="challengeId" value={challengeId} />
          <Input
            name="flag"
            required
            placeholder="flag{your_flag_here}"
            className="font-mono flex-1"
          />
          <Button type="submit" disabled={pending} size="md">
            <Send className="h-4 w-4" />
            {pending ? "..." : "Submit"}
          </Button>
        </form>
      )}
    </div>
  )
}
