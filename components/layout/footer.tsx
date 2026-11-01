export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-secondary)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="block h-3 w-3 bg-[var(--accent)]" aria-hidden="true" />
          <span className="font-stencil text-xl font-black uppercase tracking-wide">Machine Minds</span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">Parivartan 2026</span>
        </div>
        <p className="font-display text-xl font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          Think. Decode. Conquer.
        </p>
      </div>
    </footer>
  )
}
