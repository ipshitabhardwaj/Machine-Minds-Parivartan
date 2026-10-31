export const instant = false

import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Flag, FileText, CheckCircle, Trophy, AlertTriangle } from "lucide-react"

export default async function AdminOverviewPage() {
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalTeams },
    { count: totalChallenges },
    { count: activeChallenges },
    { count: totalSubmissions },
    { count: correctSubmissions },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("teams").select("*", { count: "exact", head: true }),
    admin.from("challenges").select("*", { count: "exact", head: true }),
    admin
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    admin.from("submissions").select("*", { count: "exact", head: true }),
    admin
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("is_correct", true),
  ])

  const { data: settings } = await admin
    .from("competition_settings")
    .select("key, value")

  const settingsMap = Object.fromEntries(
    (settings || []).map((s: { key: string; value: string }) => [s.key, s.value])
  )

  const stats = [
    {
      icon: Users,
      label: "Registered Users",
      value: totalUsers || 0,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Trophy,
      label: "Teams",
      value: totalTeams || 0,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Flag,
      label: "Challenges",
      value: `${activeChallenges || 0} / ${totalChallenges || 0}`,
      subtitle: "active / total",
      color: "text-[var(--accent-green)]",
      bg: "bg-[var(--accent-green)]/10",
    },
    {
      icon: FileText,
      label: "Submissions",
      value: totalSubmissions || 0,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      icon: CheckCircle,
      label: "Correct Solves",
      value: correctSubmissions || 0,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: AlertTriangle,
      label: "Competition Status",
      value:
        settingsMap.is_active === "true"
          ? settingsMap.is_paused === "true"
            ? "Paused"
            : "Active"
          : "Not Started",
      color:
        settingsMap.is_active === "true"
          ? "text-green-400"
          : "text-yellow-400",
      bg:
        settingsMap.is_active === "true"
          ? "bg-green-500/10"
          : "bg-yellow-500/10",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
