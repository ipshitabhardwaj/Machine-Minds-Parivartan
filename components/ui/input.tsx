import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:outline-none focus:border-[var(--border-accent)] focus:ring-1 focus:ring-[var(--border-accent)] disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
