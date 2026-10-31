export const instant = false

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { requireAdmin } from "@/lib/auth"
import Link from "next/link"
import {
  LayoutDashboard,
  Flag,
  Users,
  FileText,
  Settings,
} from "lucide-react"

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/challenges", label: "Challenges", icon: Flag },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/submissions", label: "Submissions", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireAdmin()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={{
          email: profile.email,
          display_name: profile.display_name,
          is_admin: true,
        }}
      />

      <div className="flex-1 flex flex-col">
        {/* Admin sub-nav */}
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto py-2 -mb-px">
              {adminLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10 transition-colors whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <main className="flex-1">{children}</main>
      </div>

      <Footer />
    </div>
  )
}
