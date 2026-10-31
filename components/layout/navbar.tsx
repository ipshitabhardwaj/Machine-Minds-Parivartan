"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  Shield,
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
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <Shield className="h-5 w-5 text-[var(--accent-primary)] group-hover:text-[var(--neon-blue)] transition-colors" />
            <span className="font-mono font-bold text-base tracking-tight">
              <span className="text-[var(--accent-primary)]">MM</span>
              <span className="text-[var(--text-muted)]">{"/"}</span>
              <span className="text-[var(--text-primary)]">CTF</span>
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-0.5 bg-[var(--bg-card)]/50 rounded-xl border border-[var(--border-primary)] px-1.5 py-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                )
              })}
              {user.is_admin && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/admin")
                      ? "text-[var(--neon-pink)] bg-[var(--neon-pink)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
                  )}
                >
                  <Settings className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {user.display_name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10 transition-all duration-200 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                >
                  Register
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-white/[0.03] cursor-pointer"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            {!user && (
              <div className="md:hidden flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]">
                  Sign In
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm font-bold rounded-lg bg-[var(--accent-primary)] text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && mobileOpen && (
        <div className="md:hidden border-t border-white/[0.04] bg-[var(--bg-secondary)]/95 backdrop-blur-xl">
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
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
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
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  pathname.startsWith("/admin")
                    ? "text-[var(--neon-pink)] bg-[var(--neon-pink)]/10"
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
