"use client"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span
        className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.3em] text-[var(--accent-green)]/80"
        aria-hidden="true"
        style={{
          textShadow: "0 0 20px rgba(74, 222, 128, 0.3), 0 0 40px rgba(74, 222, 128, 0.1)",
        }}
      >
        {text}
      </span>
    </div>
  )
}
