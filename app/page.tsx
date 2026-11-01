import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { CipherWheel, PodiumDrawing } from "@/components/effects/cyber-art"
import { Terminal, Lock, Search, Cpu, Binary } from "lucide-react"

const categories = [
  { icon: Terminal, label: "Web", desc: "Inspect page source, hidden files and requests to find what the site is hiding." },
  { icon: Lock, label: "Basic Crypto", desc: "Decode simple ciphers and encodings. Recognising the pattern is half the work." },
  { icon: Search, label: "Digital Forensics", desc: "Look through files and metadata for evidence someone left behind." },
  { icon: Cpu, label: "OSINT", desc: "Follow open-source clues across the public web to a specific answer." },
  { icon: Binary, label: "Misc", desc: "Puzzles that fit nowhere else, and often the most fun." },
]

const steps = [
  { title: "Get your login", desc: "The organisers give each team of two a Team ID and password." },
  { title: "Log in", desc: "Open this site on your device and sign in when the event starts." },
  { title: "Find flags", desc: "Solve challenges and submit each flag in the format flag{...}." },
  { title: "Climb the board", desc: "Points rank teams live. The top three win cash prizes." },
]

const titleBlock = [
  { k: "event", v: "Parivartan 2026" },
  { k: "format", v: "Jeopardy CTF" },
  { k: "duration", v: "2–3 hrs" },
  { k: "team size", v: "2" },
  { k: "entry fee", v: "₹50" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="block h-4 w-4 bg-[var(--accent)]" aria-hidden="true" />
            <span className="font-stencil text-2xl font-black uppercase leading-none tracking-wide">
              Machine Minds
            </span>
          </Link>
          <nav className="flex items-center gap-5 font-mono text-sm">
            <Link href="/rules" className="hidden sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Rules
            </Link>
            <Link
              href="/login"
              className="font-bold bg-[var(--accent)] text-[#080c33] px-4 py-1.5 hover:bg-[var(--accent-bright)] transition-colors"
            >
              Team log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: the drawing sheet */}
        <section className="sheet relative overflow-hidden pt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42rem)] gap-6 items-center">
            <div className="relative z-10">
              <h1 className="font-stencil font-extrabold uppercase leading-[0.84] tracking-[0.015em] text-[clamp(4.75rem,10.4vw,12rem)] max-lg:text-[23vw] -ml-1">
                Machine
                <br />
                Minds
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                <span className="stamp inline-block border-[3px] border-[var(--accent)] text-[var(--accent)] px-4 py-2 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wider">
                  Think. Decode. Conquer.
                </span>
              </div>

              <p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
                Hidden flags, simple clues and a live scoreboard. No security
                background needed, only curiosity and creative searching. Teams
                of two at Parivartan 2026.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
                <Link
                  href="/login"
                  className="bg-[var(--accent)] text-[#080c33] font-bold px-6 py-3 shadow-[4px_4px_0_#080c33] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#080c33] transition-all"
                >
                  Team log in
                </Link>
                <Link
                  href="/rules"
                  className="border-2 border-[var(--text-primary)] font-bold px-6 py-3 hover:bg-[var(--text-primary)] hover:text-[#080c33] transition-colors"
                >
                  Read the rules
                </Link>
              </div>
            </div>

            <div className="relative lg:-mr-12 min-w-0">
              <CipherWheel className="w-full h-auto" />
            </div>
          </div>

          {/* Title block */}
          <div className="relative border-t-2 border-[var(--text-primary)] bg-[var(--bg-primary)]">
            <dl className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 divide-x divide-[var(--line)]">
              {titleBlock.map((t) => (
                <div key={t.k} className="px-4 sm:px-8 py-4">
                  <dt className="font-mono text-xs text-[var(--text-secondary)]">{t.k}</dt>
                  <dd className="font-display text-3xl font-bold uppercase leading-tight">{t.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Parts list: the six categories */}
        <section className="border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 grid lg:grid-cols-[0.8fr_1.6fr] gap-10">
            <div>
              <h2 className="font-display text-5xl sm:text-6xl font-extrabold uppercase leading-[0.9] tracking-tight">
                Five categories
              </h2>
              <p className="mt-4 max-w-xs text-[var(--text-secondary)] leading-relaxed">
                Easy, medium and hard challenges in each. Harder flags are worth
                more points.
              </p>
            </div>

            <ul className="border-t border-[var(--line)]">
              {categories.map((cat) => (
                <li key={cat.label} className="part-row border-b border-[var(--line)] px-4 py-5 grid sm:grid-cols-[2.5rem_14rem_1fr] gap-x-4 gap-y-1 items-baseline">
                  <cat.icon className="h-5 w-5 text-[var(--accent)] self-center" aria-hidden="true" />
                  <h3 className="font-display text-3xl font-bold uppercase leading-none">{cat.label}</h3>
                  <p className="part-desc text-sm text-[var(--text-secondary)] leading-relaxed">{cat.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Assembly sequence */}
        <section className="border-b border-[var(--line)] bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
            <h2 className="font-display text-5xl sm:text-6xl font-extrabold uppercase leading-[0.9] tracking-tight mb-14">
              From login to podium
            </h2>
            <ol className="grid md:grid-cols-4 border-t-2 border-[var(--text-primary)]">
              {steps.map((st, i) => (
                <li key={st.title} className="relative pt-8 pb-4 md:pr-8 md:border-r md:last:border-r-0 border-[var(--line)] md:pl-8 md:first:pl-0">
                  <span className="absolute -top-[7px] left-0 md:left-8 md:first:left-0 h-3 w-3 bg-[var(--accent)]" aria-hidden="true" />
                  <span className="font-display text-7xl font-extrabold leading-none text-[var(--accent)]">{i + 1}</span>
                  <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-none">{st.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-[16rem]">{st.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-display text-5xl sm:text-7xl font-extrabold uppercase leading-[0.88] tracking-tight">
                Win up to
                <br />
                ₹8,000
              </h2>
              <p className="mt-5 max-w-md text-[var(--text-secondary)] leading-relaxed">
                Teams of two are registered by the organisers, who hand out each
                team&apos;s login. Challenges stay locked until the event starts,
                so everyone begins together. Participation fee ₹50.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-block bg-[var(--accent)] text-[#080c33] font-mono text-sm font-bold px-6 py-3 shadow-[4px_4px_0_var(--text-primary)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--text-primary)] transition-all"
              >
                Team log in
              </Link>
            </div>
            <figure className="max-w-sm md:ml-auto w-full">
              <PodiumDrawing className="w-full h-auto" />
              <figcaption className="mt-4 grid grid-cols-3 text-center font-display text-3xl font-bold leading-none">
                <span>
                  <span className="block mb-1 font-mono text-xs font-normal text-[var(--text-secondary)]">2nd</span>₹6,000
                </span>
                <span className="font-bold text-[var(--accent)]">
                  <span className="block mb-1 font-mono text-xs font-normal text-[var(--text-secondary)]">1st</span>₹8,000
                </span>
                <span>
                  <span className="block mb-1 font-mono text-xs font-normal text-[var(--text-secondary)]">3rd</span>₹4,000
                </span>
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
