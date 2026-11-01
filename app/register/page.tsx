import Link from "next/link"
import { Shield } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-[var(--accent)]" />
          <span className="font-stencil text-2xl font-black uppercase tracking-wide">
            Machine Minds
          </span>
        </Link>
        <div className="cyber-panel p-8">
          <h1 className="text-2xl font-bold mb-3">Teams are registered by the organisers</h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
            There is nothing to sign up for here. If you registered for the event,
            your team&apos;s Team ID and password will be handed to you by the
            organisers.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[var(--accent)] text-[#080c33] font-mono text-sm font-bold px-6 py-3 hover:bg-[var(--accent-bright)] transition-colors"
          >
            Team log in
          </Link>
        </div>
      </div>
    </div>
  )
}
