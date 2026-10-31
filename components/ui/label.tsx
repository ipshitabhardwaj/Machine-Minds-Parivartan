import { cn } from "@/lib/utils"
import type { LabelHTMLAttributes } from "react"

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-bold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider",
        className
      )}
      {...props}
    />
  )
}
