export const instant = false

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getProfile } from "@/lib/auth"
import { Shield, ArrowLeft } from "lucide-react"

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
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-[var(--accent-green)]" />
          <div>
            <h1 className="text-2xl font-bold">Competition Rules</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              MACHINE MINDS &mdash; Parivartan 2026
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)]"
            >
              <span className="text-[var(--accent-green)] font-mono font-bold text-sm mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-green)]/5">
          <h2 className="text-lg font-semibold text-[var(--accent-green)] mb-2">
            Flag Format
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-3">
            Unless specified otherwise, all flags follow this format:
          </p>
          <code className="block p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] font-mono text-[var(--accent-green)] text-lg">
            MM&#123;your_flag_here&#125;
          </code>
        </div>
      </main>

      <Footer />
    </div>
  )
}
