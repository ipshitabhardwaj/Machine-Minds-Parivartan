"use client"

import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          {
            "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dim)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] focus:ring-[var(--accent-primary)]":
              variant === "primary",
            "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent-primary)]/30 focus:ring-[var(--accent-primary)]":
              variant === "secondary",
            "bg-red-950/60 text-red-300 border border-red-800/40 hover:bg-red-900/60 hover:border-red-700/50 focus:ring-red-500":
              variant === "danger",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03] focus:ring-[var(--accent-primary)]":
              variant === "ghost",
            "border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 focus:ring-[var(--accent-primary)]":
              variant === "outline",
          },
          {
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2.5": size === "md",
            "text-base px-6 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
