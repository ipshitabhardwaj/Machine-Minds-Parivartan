"use client"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.3em] text-[var(--accent)]/80">
        {text}
      </span>
    </div>
  )
}
