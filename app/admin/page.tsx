export const instant = false

import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Flag, FileText, CheckCircle, Trophy, AlertTriangle, Shield } from "lucide-react"

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
      color: "text-[var(--accent-primary)]",
      bg: "bg-[var(--accent-primary)]/10",
    },
    {
      icon: Trophy,
      label: "Teams",
      value: totalTeams || 0,
      color: "text-[var(--accent-purple)]",
      bg: "bg-[var(--accent-purple)]/10",
    },
    {
      icon: Flag,
      label: "Challenges",
      value: `${activeChallenges || 0} / ${totalChallenges || 0}`,
      subtitle: "active / total",
      color: "text-[var(--neon-blue)]",
      bg: "bg-[var(--neon-blue)]/10",
    },
    {
      icon: FileText,
      label: "Submissions",
      value: totalSubmissions || 0,
      color: "text-[var(--accent-yellow)]",
      bg: "bg-[var(--accent-yellow)]/10",
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
          : "text-[var(--accent-yellow)]",
      bg:
        settingsMap.is_active === "true"
          ? "bg-green-500/10"
          : "bg-[var(--accent-yellow)]/10",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-[var(--neon-pink)]/10">
          <Shield className="h-5 w-5 text-[var(--neon-pink)]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-[var(--text-muted)] text-xs font-mono">{">"} System overview</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black font-mono">{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] font-medium">
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
