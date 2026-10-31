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
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        {
          "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-primary)]":
            variant === "default",
          "bg-green-950 text-green-400 border border-green-800":
            variant === "success",
          "bg-yellow-950 text-yellow-400 border border-yellow-800":
            variant === "warning",
          "bg-red-950 text-red-400 border border-red-800":
            variant === "danger",
          "bg-blue-950 text-blue-400 border border-blue-800":
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
