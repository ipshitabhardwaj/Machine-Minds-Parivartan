"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  Flag,
  Trophy,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react"

interface NavbarProps {
  user: { email: string; display_name: string; is_admin: boolean } | null
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Flag },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/rules", label: "Rules", icon: BookOpen },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <span className="block h-3.5 w-3.5 bg-[var(--accent)]" aria-hidden="true" />
            <span className="font-stencil text-xl font-black uppercase leading-none tracking-wide">Machine Minds</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-0.5 border border-[var(--border-primary)] px-1 py-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-colors",
                      isActive
                        ? "text-[var(--accent)] bg-[var(--accent)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {link.label}
                  </Link>
                )
              })}
              {user.is_admin && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "text-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                  )}
                >
                  <Settings className="h-3 w-3" />
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                  {user.display_name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm font-mono font-bold bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] transition-colors"
                >
                  register
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] cursor-pointer"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            {!user && (
              <div className="md:hidden flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm font-mono text-[var(--text-secondary)]">
                  login
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm font-mono font-bold bg-[var(--accent)] text-[var(--bg-primary)]">
                  register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 text-xs font-mono font-medium transition-colors",
                    isActive
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
            {user.is_admin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 text-xs font-mono font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "text-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
