import { cn } from "@/lib/utils"
import { forwardRef, type TextareaHTMLAttributes } from "react"

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 disabled:opacity-50 min-h-[120px] resize-y",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
