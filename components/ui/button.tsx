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
          "inline-flex items-center justify-center gap-2 font-mono font-bold transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:ring-offset-1 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          {
            "bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)]":
              variant === "primary",
            "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]":
              variant === "secondary",
            "bg-red-950/60 text-red-300 border border-red-800/40 hover:bg-red-900/60 hover:border-red-700/50":
              variant === "danger",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]":
              variant === "ghost",
            "border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5":
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
