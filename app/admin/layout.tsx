export const instant = false

import { connection } from "next/server"
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
  Upload,
} from "lucide-react"

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/challenges", label: "Challenges", icon: Flag },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/import", label: "Import teams", icon: Upload },
  { href: "/admin/submissions", label: "Submissions", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection()

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
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-0.5 overflow-x-auto py-2 -mb-px">
              {adminLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/10 transition-colors whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5" />
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
