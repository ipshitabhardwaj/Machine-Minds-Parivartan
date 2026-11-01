import { cn } from "@/lib/utils"
import { forwardRef, type SelectHTMLAttributes } from "react"

const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm font-mono text-[var(--text-primary)] transition-colors focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 disabled:opacity-50 appearance-none cursor-pointer",
        className
      )}
      {...props}
    />
  )
})
Select.displayName = "Select"

export { Select }
