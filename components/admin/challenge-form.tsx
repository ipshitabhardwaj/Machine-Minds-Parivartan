"use client"

import { useActionState, useState } from "react"
import { createChallenge } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AlertCircle, Plus, X } from "lucide-react"

export function AdminChallengeForm() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(createChallenge, {
    error: null,
    success: false,
  })

  if (state.success && open) {
    setOpen(false)
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4" />
        Add Challenge
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">New Challenge</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-[var(--bg-card)] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" required>
                <option value="web">Web Exploitation</option>
                <option value="crypto">Cryptography</option>
                <option value="forensics">Digital Forensics</option>
                <option value="osint">OSINT</option>
                <option value="misc">Miscellaneous</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Markdown)</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="# Challenge Title&#10;&#10;Write your challenge description here..."
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select id="difficulty" name="difficulty" required>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                name="points"
                type="number"
                required
                min={1}
                defaultValue={100}
              />
            </div>
            <div>
              <Label htmlFor="flag">Flag (plaintext)</Label>
              <Input
                id="flag"
                name="flag"
                required
                placeholder="flag{your_flag}"
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hint">Hint (optional)</Label>
              <Input id="hint" name="hint" placeholder="Optional hint text" />
            </div>
            <div>
              <Label htmlFor="hintPenalty">Hint Penalty (points)</Label>
              <Input
                id="hintPenalty"
                name="hintPenalty"
                type="number"
                min={0}
                defaultValue={0}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="attachmentUrl">Attachment URL (optional)</Label>
            <Input
              id="attachmentUrl"
              name="attachmentUrl"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="rounded border-[var(--border-primary)] bg-[var(--bg-input)]"
            />
            <Label htmlFor="isActive" className="mb-0">
              Active (visible to participants)
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Challenge"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
