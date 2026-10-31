import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline"
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold tracking-wide",
        {
          "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-primary)]":
            variant === "default",
          "bg-green-950/60 text-green-400 border border-green-800/40":
            variant === "success",
          "bg-yellow-950/60 text-yellow-400 border border-yellow-800/40":
            variant === "warning",
          "bg-red-950/60 text-red-400 border border-red-800/40":
            variant === "danger",
          "bg-blue-950/60 text-blue-400 border border-blue-800/40":
            variant === "info",
          "border border-[var(--border-primary)] text-[var(--text-secondary)]":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}
