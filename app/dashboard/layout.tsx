export const instant = false

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { requireAuth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={{
          email: profile.email,
          display_name: profile.display_name,
          is_admin: profile.is_admin,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
