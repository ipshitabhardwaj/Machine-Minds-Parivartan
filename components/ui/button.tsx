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
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          {
            "bg-[var(--accent-green-dim)] text-white hover:bg-[var(--accent-green)] hover:text-black focus:ring-[var(--accent-green)]":
              variant === "primary",
            "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] focus:ring-[var(--border-accent)]":
              variant === "secondary",
            "bg-red-900/50 text-red-300 border border-red-800 hover:bg-red-900 focus:ring-red-500":
              variant === "danger",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] focus:ring-[var(--border-accent)]":
              variant === "ghost",
            "border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-[var(--border-accent)] hover:text-[var(--accent-green)] focus:ring-[var(--border-accent)]":
              variant === "outline",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
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
