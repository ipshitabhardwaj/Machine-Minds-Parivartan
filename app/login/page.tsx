"use client"

import { Suspense } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, Terminal } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || ""
  const [state, formAction, pending] = useActionState(login, { error: null as string | null })

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Shield className="h-7 w-7 text-[var(--accent-primary)]" />
          <span className="font-mono font-bold text-lg">
            <span className="text-[var(--accent-primary)]">MM</span>
            <span className="text-[var(--text-muted)]">{"/"}</span>
            <span className="text-[var(--text-primary)]">CTF</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Sign In</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Access your terminal
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />

          {state.error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
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
              placeholder="Your password"
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
                Sign In
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        No account?{" "}
        <Link
          href="/register"
          className="text-[var(--accent-primary)] hover:text-[var(--neon-blue)] font-medium transition-colors"
        >
          Register
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative z-10">
        <Suspense fallback={<div className="text-[var(--text-muted)] font-mono text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
