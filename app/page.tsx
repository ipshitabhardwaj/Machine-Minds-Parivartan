import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import {
  Shield,
  Flag,
  Trophy,
  Users,
  Terminal,
  Lock,
  Search,
  Bot,
  Cpu,
  Binary,
  ArrowRight,
} from "lucide-react"

const categories = [
  { icon: Terminal, label: "Web Exploitation", color: "text-green-400" },
  { icon: Lock, label: "Cryptography", color: "text-blue-400" },
  { icon: Search, label: "Digital Forensics", color: "text-purple-400" },
  { icon: Cpu, label: "OSINT", color: "text-yellow-400" },
  { icon: Binary, label: "Reverse Engineering", color: "text-orange-400" },
  { icon: Bot, label: "AI & Prompt Security", color: "text-cyan-400" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[var(--accent-green)]" />
            <span className="font-mono font-bold text-lg">
              <span className="text-[var(--accent-green)]">MACHINE</span>
              <span className="text-[var(--text-primary)]"> MINDS</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-green-dim)] text-white hover:bg-[var(--accent-green)] hover:text-black transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-green)]/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-32 sm:pb-24 relative">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[var(--accent-green)] font-mono text-sm tracking-widest mb-4">
                PARIVARTAN 2026 PRESENTS
              </p>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                <span className="text-[var(--accent-green)]">MACHINE</span>
                <br />
                <span className="text-[var(--text-primary)]">MINDS</span>
              </h1>
              <p className="font-mono text-[var(--text-secondary)] text-lg sm:text-xl mb-2 tracking-wider">
                THINK. DECODE. CONQUER.
              </p>
              <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-xl mx-auto mb-10">
                A Capture The Flag competition testing your skills across web exploitation,
                cryptography, forensics, OSINT, reverse engineering and AI security.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium rounded-lg bg-[var(--accent-green-dim)] text-white hover:bg-[var(--accent-green)] hover:text-black transition-all"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/rules"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium rounded-lg border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors"
                >
                  View Rules
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Flag, value: "6+", label: "Categories" },
                { icon: Trophy, value: "8+", label: "Challenges" },
                { icon: Users, value: "∞", label: "Teams" },
                { icon: Shield, value: "MM{}", label: "Flag Format" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-6 w-6 text-[var(--accent-green)] mx-auto mb-2" />
                  <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Challenge Categories
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-12 max-w-lg mx-auto">
            Test your skills across six domains of cybersecurity
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-accent)] transition-colors group"
              >
                <cat.icon
                  className={`h-8 w-8 ${cat.color} mb-3 group-hover:scale-110 transition-transform`}
                />
                <h3 className="font-medium text-[var(--text-primary)]">
                  {cat.label}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
