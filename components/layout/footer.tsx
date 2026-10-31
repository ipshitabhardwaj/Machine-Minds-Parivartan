import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--accent-green)]" />
            <span className="font-mono text-sm font-bold">
              <span className="text-[var(--accent-green)]">MACHINE</span>
              <span className="text-[var(--text-primary)]"> MINDS</span>
            </span>
            <span className="text-[var(--text-muted)] text-xs ml-2">
              PARIVARTAN 2026
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-xs">
            THINK. DECODE. CONQUER.
          </p>
        </div>
      </div>
    </footer>
  )
}
