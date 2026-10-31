import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[var(--bg-secondary)] mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-[var(--accent-primary)]" />
            <span className="font-mono text-sm font-bold tracking-tight">
              <span className="text-[var(--accent-primary)]">MM</span>
              <span className="text-[var(--text-muted)]">{"/"}</span>
              <span className="text-[var(--text-primary)]">CTF</span>
            </span>
            <span className="text-[var(--text-muted)] text-[10px] ml-2 px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-primary)] font-mono uppercase tracking-wider">
              Parivartan 2026
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-xs font-mono tracking-[0.3em] uppercase">
            Think &middot; Decode &middot; Conquer
          </p>
        </div>
      </div>
    </footer>
  )
}
