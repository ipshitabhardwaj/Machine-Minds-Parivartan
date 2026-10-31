import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { MatrixRain } from "@/components/effects/matrix-rain"
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
  Zap,
  Crosshair,
  Skull,
  ChevronRight,
} from "lucide-react"

const categories = [
  {
    icon: Terminal,
    label: "Web Exploitation",
    desc: "Inject, bypass, escalate — own the web stack",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    borderHover: "hover:border-blue-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
  },
  {
    icon: Lock,
    label: "Cryptography",
    desc: "Break ciphers, crack hashes, decode the undecoded",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    borderHover: "hover:border-cyan-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]",
  },
  {
    icon: Search,
    label: "Digital Forensics",
    desc: "Extract truth from files, memory dumps & packets",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(167,139,250,0.1)]",
  },
  {
    icon: Cpu,
    label: "OSINT",
    desc: "Trace the digital trail, reveal what hides in plain sight",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    borderHover: "hover:border-yellow-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(250,204,21,0.1)]",
  },
  {
    icon: Binary,
    label: "Reverse Engineering",
    desc: "Disassemble, decompile, and decode hidden logic",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    borderHover: "hover:border-orange-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(251,146,60,0.1)]",
  },
  {
    icon: Bot,
    label: "AI Security",
    desc: "Jailbreak models, exploit prompts, poison the pipeline",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    borderHover: "hover:border-pink-500/40",
    shadowHover: "hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-[var(--neon-blue)]" />
            <span className="font-mono font-bold text-lg tracking-tight">
              <span className="text-[var(--neon-blue)] neon-text">MM</span>
              <span className="text-[var(--text-muted)]">{"/"}</span>
              <span className="text-[var(--text-primary)]">CTF</span>
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
              className="group px-5 py-2 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dim)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
            >
              Register <ChevronRight className="inline h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="absolute inset-0 bg-grid" />
          <MatrixRain />

          {/* Top neon line */}
          <div className="absolute top-16 inset-x-0 neon-line" />

          {/* Corner decorations */}
          <div className="absolute top-24 left-8 hidden lg:block">
            <div className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed opacity-40">
              <div>SYS.INIT <span className="text-[var(--neon-blue)]">OK</span></div>
              <div>NET.SCAN <span className="text-[var(--neon-blue)]">ACTIVE</span></div>
              <div>CTF.MODE <span className="text-green-400">ARMED</span></div>
              <div>TARGETS <span className="text-[var(--neon-pink)]">LOCKED</span></div>
            </div>
          </div>
          <div className="absolute top-24 right-8 hidden lg:block text-right">
            <div className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed opacity-40">
              <div>REV://0x<span className="text-[var(--neon-blue)]">4F2A</span></div>
              <div>SEC.LVL <span className="text-[var(--accent-coral)]">MAX</span></div>
              <div>CRYPTO <span className="text-[var(--neon-blue)]">256-BIT</span></div>
              <div>SIGNAL <span className="text-green-400">▓▓▓▓▓</span></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 sm:pt-32 sm:pb-28 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Pre-heading badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 mb-8" style={{ animationDelay: "0s" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]" />
                </span>
                <span className="text-[var(--accent-primary)] font-mono text-xs tracking-[0.2em] uppercase font-bold">
                  Parivartan 2026
                </span>
              </div>

              {/* Main title */}
              <h1 className="animate-fade-in-up text-6xl sm:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] leading-[0.85] mb-6" style={{ animationDelay: "0.1s" }}>
                <span className="bg-gradient-to-r from-[var(--neon-blue)] via-[var(--accent-primary)] to-[var(--neon-pink)] bg-clip-text text-transparent">
                  MACHINE
                </span>
                <br />
                <span className="text-[var(--text-primary)]">
                  MINDS
                </span>
              </h1>

              {/* Tagline */}
              <div className="animate-fade-in-up mb-3" style={{ animationDelay: "0.2s" }}>
                <span className="font-mono text-lg sm:text-2xl font-bold tracking-[0.4em] text-[var(--neon-blue)]/70 uppercase">
                  Think. Decode. Conquer.
                </span>
              </div>

              <p className="animate-fade-in-up text-[var(--text-secondary)] text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed" style={{ animationDelay: "0.3s" }}>
                A Capture The Flag competition pushing your cybersecurity skills to the edge.
                Six domains. One leaderboard. No mercy.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: "0.4s" }}>
                <Link
                  href="/register"
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--neon-blue)] text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300"
                >
                  Enter the Arena
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/rules"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/5 transition-all duration-300"
                >
                  <Crosshair className="h-4 w-4" />
                  Rules of Engagement
                </Link>
              </div>

              {/* Terminal block */}
              <div className="animate-fade-in-up mt-16 max-w-md mx-auto" style={{ animationDelay: "0.55s" }}>
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)]/80 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-coral)]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-yellow)]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-[10px] font-mono text-[var(--text-muted)]">terminal</span>
                  </div>
                  <div className="px-4 py-3 font-mono text-sm">
                    <div className="text-[var(--text-muted)]">
                      <span className="text-[var(--neon-blue)]">$</span> cat flag_format.txt
                    </div>
                    <div className="text-[var(--accent-primary)] mt-1">
                      MM&#123;your_flag_here&#125;
                    </div>
                    <div className="text-[var(--text-muted)] mt-1 flex items-center">
                      <span className="text-[var(--neon-blue)]">$</span>
                      <span className="ml-1 terminal-cursor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
        </section>

        {/* ── Stats Section ── */}
        <section className="relative border-y border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="absolute inset-0 bg-dots opacity-40" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
              {[
                { icon: Flag, value: "6+", label: "Categories", color: "text-[var(--accent-primary)]", bg: "bg-[var(--accent-primary)]/10" },
                { icon: Skull, value: "8+", label: "Challenges", color: "text-[var(--neon-pink)]", bg: "bg-[var(--neon-pink)]/10" },
                { icon: Users, value: "∞", label: "Teams", color: "text-[var(--neon-blue)]", bg: "bg-[var(--neon-blue)]/10" },
                { icon: Zap, value: "1st", label: "Blood Tracked", color: "text-[var(--accent-yellow)]", bg: "bg-[var(--accent-yellow)]/10" },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${stat.bg} border border-[var(--border-primary)] mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-[var(--text-primary)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories Section ── */}
        <section className="relative">
          <div className="absolute inset-0 bg-circuit" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/20 mb-4">
                <span className="font-mono text-xs text-[var(--accent-primary)] tracking-wider uppercase font-bold">{"// Attack Vectors"}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Challenge Categories
              </h2>
              <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-lg">
                Six domains of warfare. Choose your battleground.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className={`group relative p-7 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden transition-all duration-300 card-hover ${cat.borderHover} ${cat.shadowHover}`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-6 right-6 h-px ${cat.bg} opacity-0 group-hover:opacity-100 transition-opacity`} style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }} />

                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${cat.bg} mb-5`}>
                    <cat.icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {cat.desc}
                  </p>

                  {/* Corner decoration */}
                  <div className="absolute bottom-3 right-4 font-mono text-[10px] text-[var(--text-muted)]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    &gt;_
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
            <div className="relative rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-grid-dense opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-[var(--neon-pink)]/5" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[var(--neon-pink)]/30 to-transparent" />

              <div className="relative z-10 p-10 sm:p-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--neon-pink)]/10 border border-[var(--accent-primary)]/20 mb-6">
                  <Trophy className="h-8 w-8 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
                  Ready to prove yourself?
                </h2>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-10 text-lg">
                  Register your team, crack the challenges, dominate the leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--neon-blue)] text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300"
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/30 transition-all duration-300"
                  >
                    Already registered? Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
