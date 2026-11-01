export const instant = false

import { connection } from "next/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { requireAuth } from "@/lib/auth"

export default async function ChallengesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection()

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
