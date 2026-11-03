export const instant = false

import { connection } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Slips } from "@/components/admin/slips"

export default async function SlipsPage() {
  await connection()
  const admin = createAdminClient()
  const { data: teams } = await admin
    .from("teams")
    .select("id, name, team_code, member1_name, member2_name, college, login_password")
    .order("team_code", { ascending: true })

  return (
    <Slips
      teams={(teams || []).map((t) => ({
        id: t.id as string,
        name: t.name as string,
        code: (t.team_code as string | null) ?? "",
        member1: (t.member1_name as string | null) ?? "",
        member2: (t.member2_name as string | null) ?? "",
        college: (t.college as string | null) ?? "",
        password: (t.login_password as string | null) ?? "",
      }))}
    />
  )
}
