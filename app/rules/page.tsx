export const instant = false

import { connection } from "next/server"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getProfile } from "@/lib/auth"
import { Shield, ArrowLeft, AlertTriangle, Terminal } from "lucide-react"

const rules = [
  "Each team has exactly 2 members and uses the one Team ID and password issued by the organisers. Do not share them with other teams.",
  "Each correct flag earns points based on its difficulty: easy, medium or hard.",
  "Submit flags through this portal in the exact format given, for example flag{...}.",
  "You may use any legal online resource, including Google, documentation and tutorials.",
  "Do not share flags or hints with other teams.",
  "Do not post flags or hints on public platforms such as Discord or social media during the contest.",
  "Attacking the CTF infrastructure, brute-forcing the scoreboard or any denial-of-service attempt is forbidden and leads to disqualification.",
  "The leaderboard is live. If teams tie on points, the team that reached that total first ranks higher.",
  "Some challenges have an optional hint. Taking a hint reduces the points you earn for that challenge.",
  "Once the competition starts, you cannot switch teams.",
  "Final positions and winners are declared based on the entries received.",
  "The organising committee's decisions are final.",
]

const details = [
  { k: "Format", v: "Jeopardy-style, point scoring" },
  { k: "Duration", v: "2–3 hours" },
  { k: "Team size", v: "2 members" },
  { k: "Categories", v: "Web, basic crypto, forensics, OSINT, misc" },
  { k: "Participation fee", v: "₹50" },
  { k: "Prizes", v: "1st ₹8,000, 2nd ₹6,000, 3rd ₹4,000" },
]

export default async function RulesPage() {
  await connection()

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
          className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8 transition-colors font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-[var(--accent)]/10">
            <Shield className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Rules of Engagement</h1>
            <p className="text-[var(--text-muted)] text-sm font-mono">
              {"MM:CTF"} &mdash; Parivartan 2026
            </p>
          </div>
        </div>

        <dl className="mb-8 grid sm:grid-cols-2 border border-[var(--line)] bg-[var(--bg-card)]">
          {details.map((d) => (
            <div key={d.k} className="px-4 py-3 border-b border-[var(--line)] sm:odd:border-r last:border-b-0">
              <dt className="font-mono text-xs text-[var(--text-secondary)]">{d.k}</dt>
              <dd className="font-bold">{d.v}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2 stagger">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)] transition-colors"
            >
              <span className="text-[var(--accent)] font-mono font-black text-sm mt-0.5 shrink-0 w-6 text-right">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[var(--text-primary)] text-sm leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-[var(--accent)]/20 bg-[var(--bg-card)] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <Terminal className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Flag Format</span>
          </div>
          <div className="p-6">
            <p className="text-[var(--text-secondary)] text-sm mb-3">
              Unless specified otherwise, all flags follow this format:
            </p>
            <code className="block p-4 bg-[var(--bg-primary)] border border-[var(--border-primary)] font-mono text-[var(--accent)] text-xl font-black tracking-wider">
              flag&#123;your_flag_here&#125;
            </code>
          </div>
        </div>

        <div className="mt-6 p-4 border border-yellow-800/30 bg-yellow-950/10 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-sm font-bold mb-1">Important</p>
            <p className="text-[var(--text-secondary)] text-sm">
              Breaking a rule can lead to disqualification. Final positions and winners are declared based on
              the entries received, and the organising committee&apos;s decisions are final.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
