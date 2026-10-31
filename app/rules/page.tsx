export const instant = false

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getProfile } from "@/lib/auth"
import { Shield, ArrowLeft, AlertTriangle, Terminal } from "lucide-react"

const rules = [
  "Participants must compete using their registered teams only.",
  "The flag format is MM{...} unless stated otherwise in the challenge.",
  "Sharing flags between teams is strictly prohibited and will result in disqualification.",
  "Automated brute-force attacks against the flag submission system are prohibited.",
  "Attacking the competition platform, infrastructure or other participants is prohibited.",
  "Participants must only interact with explicitly authorised challenge environments.",
  "Do not attempt to disrupt the competition for other teams.",
  "Each team can have a minimum of 2 and maximum of 4 members (configurable by admins).",
  "Once the competition starts, you cannot switch teams.",
  "Hints are available for some challenges but come with a point penalty.",
  "First blood (first solve) is tracked and displayed on the leaderboard.",
  "The organising committee's decisions are final in all matters regarding the competition.",
]

export default async function RulesPage() {
  const profile = await getProfile()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={
          profile
            ? {
                email: profile.email,
                display_name: profile.display_name,
                is_admin: profile.is_admin,
              }
            : null
        }
      />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href={profile ? "/dashboard" : "/"}
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-[var(--accent-primary)]/10">
            <Shield className="h-6 w-6 text-[var(--accent-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Rules of Engagement</h1>
            <p className="text-[var(--text-muted)] text-sm font-mono">
              {"MM//CTF"} &mdash; Parivartan 2026
            </p>
          </div>
        </div>

        <div className="space-y-3 stagger-children">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)]/20 transition-colors"
            >
              <span className="text-[var(--accent-primary)] font-mono font-black text-sm mt-0.5 shrink-0 w-6 text-right">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--accent-primary)]/20 bg-[var(--bg-card)] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <Terminal className="h-4 w-4 text-[var(--accent-primary)]" />
            <span className="font-mono text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Flag Format</span>
          </div>
          <div className="p-6">
            <p className="text-[var(--text-secondary)] text-sm mb-3">
              Unless specified otherwise, all flags follow this format:
            </p>
            <code className="block p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] font-mono text-[var(--accent-primary)] text-xl font-black tracking-wider">
              MM&#123;your_flag_here&#125;
            </code>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-yellow-800/30 bg-yellow-950/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-sm font-bold mb-1">Important</p>
            <p className="text-[var(--text-secondary)] text-sm">
              Violation of any rule may result in team disqualification. The organising committee reserves
              the right to modify rules and their decisions are final.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
