"use client"

import { useActionState } from "react"
import Link from "next/link"
import { register } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, {
    error: null as string | null,
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-[var(--accent-green)]" />
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Register for Machine Minds CTF
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
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
              placeholder="Your display name"
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
            {pending ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--accent-green)] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
