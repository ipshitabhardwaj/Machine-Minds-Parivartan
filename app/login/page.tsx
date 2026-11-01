"use client"

import { Suspense, useState } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Terminal } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || ""
  const [state, formAction, pending] = useActionState(login, { error: null as string | null })
  const [organiser, setOrganiser] = useState(false)

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="block h-4 w-4 bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-stencil text-2xl font-black uppercase leading-none tracking-wide">Machine Minds</span>
        </Link>
        <h1 className="font-display text-5xl font-extrabold uppercase leading-none tracking-tight">Team log in</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Use the Team ID and password the organisers gave your team.
        </p>
      </div>

      <div className="cyber-panel p-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />

          {state.error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-900/40 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="identifier">{organiser ? "Organiser email" : "Team ID"}</Label>
            <Input
              id="identifier"
              name="identifier"
              type={organiser ? "email" : "text"}
              required
              autoComplete="username"
              autoCapitalize={organiser ? "none" : "characters"}
              spellCheck={false}
              placeholder={organiser ? "you@example.com" : "MM-014"}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="8-character password"
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full" size="lg">
            {pending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Terminal className="h-4 w-4" />
                Log in
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        {organiser ? "Playing as a team?" : "Lost your password? Ask an organiser at the desk."}{" "}
        <button
          type="button"
          onClick={() => setOrganiser((v) => !v)}
          className="font-bold text-[var(--accent)] underline underline-offset-4 hover:text-[var(--accent-bright)]"
        >
          {organiser ? "Use Team ID" : "Organiser log in"}
        </button>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative noise">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative z-10">
        <Suspense fallback={<div className="text-[var(--text-muted)] font-mono text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
