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
    <nav className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-[var(--accent-green)]" />
            <span className="font-mono font-bold text-lg tracking-tight">
              <span className="text-[var(--accent-green)]">MACHINE</span>
              <span className="text-[var(--text-primary)]"> MINDS</span>
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
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
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "text-[var(--accent-coral)] bg-[var(--accent-coral)]/10"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-[var(--text-secondary)] font-mono">
                  {user.display_name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
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
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-green-dim)] text-white hover:bg-[var(--accent-green)] hover:text-black transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card)] cursor-pointer"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            {!user && (
              <div className="md:hidden flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--accent-green-dim)] text-white"
                >
                  Register
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
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10"
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
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "text-[var(--accent-coral)] bg-[var(--accent-coral)]/10"
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
