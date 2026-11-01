"use client"

import { useState } from "react"
import {
  updateCompetitionSetting,
  startCompetition,
  endCompetition,
  setLeaderboardFrozen,
} from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Power, Pause, Play, Lock, Flag, Users } from "lucide-react"

interface Props {
  settings: Record<string, string>
  phase: "upcoming" | "live" | "paused" | "ended"
}

// ISO (UTC) -> value for <input type="datetime-local"> in the admin's local time
function toLocalInput(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

const PHASE_LABEL: Record<Props["phase"], string> = {
  upcoming: "NOT STARTED",
  live: "LIVE",
  paused: "PAUSED",
  ended: "ENDED",
}

export function AdminSettingsForm({ settings: initial, phase: initialPhase }: Props) {
  const router = useRouter()
  const [phase, setPhase] = useState(initialPhase)
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  async function runAction(
    name: string,
    fn: () => Promise<{ error: string | null }>,
    next: Record<string, string>,
    nextPhase: Props["phase"]
  ) {
    setSaving(name)
    const res = await fn()
    setSaving(null)
    if (res.error) {
      alert(res.error)
      return
    }
    setSettings((prev) => ({ ...prev, ...next }))
    setPhase(nextPhase)
    router.refresh()
  }

  async function handleUpdate(key: string, value: string) {
    setSaving(key)
    // datetime-local has no timezone: store real UTC instants
    if ((key === "start_time" || key === "end_time") && value) {
      value = new Date(value).toISOString()
    }
    await updateCompetitionSetting(key, value)
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }


  return (
    <div className="space-y-6">
      {/* Competition Control */}
      <Card>
        <CardTitle>Competition Control</CardTitle>
        <CardDescription>
          Players cannot see challenges or submit flags until you press Start.
        </CardDescription>
        <CardContent className="mt-4 space-y-4">
          <p className="font-mono text-sm">
            STATUS:{" "}
            <span
              className={
                phase === "live"
                  ? "text-[var(--accent)] font-black"
                  : phase === "paused"
                    ? "text-[var(--accent-yellow)] font-black"
                    : phase === "ended"
                      ? "text-[var(--accent-coral)] font-black"
                      : "text-[var(--text-secondary)] font-black"
              }
            >
              {PHASE_LABEL[phase]}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            {(phase === "upcoming" || phase === "ended") && (
              <Button
                onClick={() => {
                  if (
                    phase === "ended" &&
                    !confirm("Reopen the competition? Players can submit again.")
                  )
                    return
                  runAction(
                    "start",
                    startCompetition,
                    { is_active: "true", is_paused: "false", is_ended: "false" },
                    "live"
                  )
                }}
                disabled={saving === "start"}
              >
                <Power className="h-4 w-4" />
                {phase === "ended" ? "Reopen Competition" : "Start Competition"}
              </Button>
            )}
            {(phase === "live" || phase === "paused") && (
              <>
                <Button
                  variant="secondary"
                  onClick={() =>
                    runAction(
                      "pause",
                      () =>
                        updateCompetitionSetting(
                          "is_paused",
                          phase === "paused" ? "false" : "true"
                        ).then((r) => ({ error: r.error })),
                      { is_paused: phase === "paused" ? "false" : "true" },
                      phase === "paused" ? "live" : "paused"
                    )
                  }
                  disabled={saving === "pause"}
                >
                  {phase === "paused" ? (
                    <>
                      <Play className="h-4 w-4" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      !confirm(
                        "End the competition now? Submissions close and the final top 3 are revealed."
                      )
                    )
                      return
                    runAction(
                      "end",
                      endCompetition,
                      { is_ended: "true", is_paused: "false", leaderboard_frozen: "false" },
                      "ended"
                    )
                  }}
                  disabled={saving === "end"}
                >
                  <Flag className="h-4 w-4" />
                  End Competition
                </Button>
              </>
            )}
            <Button
              variant={
                settings.leaderboard_frozen === "true" ? "secondary" : "outline"
              }
              onClick={() => {
                const next = settings.leaderboard_frozen !== "true"
                setSaving("freeze")
                setLeaderboardFrozen(next).then(() => {
                  setSettings((p) => ({
                    ...p,
                    leaderboard_frozen: next ? "true" : "false",
                  }))
                  setSaving(null)
                  router.refresh()
                })
              }}
              disabled={saving === "freeze"}
            >
              <Lock className="h-4 w-4" />
              {settings.leaderboard_frozen === "true"
                ? "Unfreeze Leaderboard"
                : "Freeze Leaderboard"}
            </Button>
            <Button
              variant={settings.teams_locked === "true" ? "secondary" : "outline"}
              onClick={() =>
                handleUpdate(
                  "teams_locked",
                  settings.teams_locked === "true" ? "false" : "true"
                )
              }
              disabled={saving === "teams_locked"}
            >
              <Users className="h-4 w-4" />
              {settings.teams_locked === "true"
                ? "Reopen Team Sign-ups"
                : "Lock Team Sign-ups"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Settings */}
      <Card>
        <CardTitle>Schedule</CardTitle>
        <CardContent className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                defaultValue={toLocalInput(settings.start_time)}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, start_time: e.target.value }))
                }
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleUpdate("start_time", settings.start_time)}
                disabled={saving === "start_time"}
              >
                {saved === "start_time" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label>End Time</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                defaultValue={toLocalInput(settings.end_time)}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, end_time: e.target.value }))
                }
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleUpdate("end_time", settings.end_time)}
                disabled={saving === "end_time"}
              >
                {saved === "end_time" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Settings */}
      <Card>
        <CardTitle>Team Configuration</CardTitle>
        <CardContent className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Min Team Size</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={10}
                defaultValue={settings.min_team_size || "2"}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    min_team_size: e.target.value,
                  }))
                }
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleUpdate("min_team_size", settings.min_team_size)
                }
                disabled={saving === "min_team_size"}
              >
                {saved === "min_team_size" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label>Max Team Size</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={10}
                defaultValue={settings.max_team_size || "4"}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    max_team_size: e.target.value,
                  }))
                }
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleUpdate("max_team_size", settings.max_team_size)
                }
                disabled={saving === "max_team_size"}
              >
                {saved === "max_team_size" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardTitle>Rate Limiting</CardTitle>
        <CardContent className="mt-4">
          <div className="max-w-xs">
            <Label>Submission Cooldown (seconds)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={300}
                defaultValue={
                  settings.submission_cooldown_seconds || "10"
                }
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    submission_cooldown_seconds: e.target.value,
                  }))
                }
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleUpdate(
                    "submission_cooldown_seconds",
                    settings.submission_cooldown_seconds
                  )
                }
                disabled={saving === "submission_cooldown_seconds"}
              >
                {saved === "submission_cooldown_seconds" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
