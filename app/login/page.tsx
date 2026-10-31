"use client"

import { Suspense } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || ""
  const [state, formAction, pending] = useActionState(login, { error: null as string | null })

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-[var(--accent-green)]" />
        </Link>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Welcome back to Machine Minds
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect} />

        {state.error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
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
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[var(--accent-green)] hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-[var(--text-muted)]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
