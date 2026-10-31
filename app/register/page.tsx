"use client"

import { useActionState } from "react"
import Link from "next/link"
import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, {
    error: null as string | null,
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-7 w-7 text-[var(--accent-primary)]" />
            <span className="font-mono font-bold text-lg">
              <span className="text-[var(--accent-primary)]">MM</span>
              <span className="text-[var(--text-muted)]">{"/"}</span>
              <span className="text-[var(--text-primary)]">CTF</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Create Account</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Join the arena
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                required
                minLength={2}
                maxLength={30}
                placeholder="Your handle"
              />
            </div>

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
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />
            </div>

            <Button type="submit" disabled={pending} className="w-full" size="lg">
              {pending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-[var(--accent-primary)] hover:text-[var(--neon-blue)] font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
