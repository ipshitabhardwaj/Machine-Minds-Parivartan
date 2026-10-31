"use client"

import { useState } from "react"
import { updateCompetitionSetting } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Power, Pause, Play, Lock } from "lucide-react"

interface Props {
  settings: Record<string, string>
}

export function AdminSettingsForm({ settings: initial }: Props) {
  const [settings, setSettings] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  async function handleUpdate(key: string, value: string) {
    setSaving(key)
    await updateCompetitionSetting(key, value)
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  async function handleToggle(key: string) {
    const current = settings[key]
    const newValue = current === "true" ? "false" : "true"
    await handleUpdate(key, newValue)
  }

  return (
    <div className="space-y-6">
      {/* Competition Control */}
      <Card>
        <CardTitle>Competition Control</CardTitle>
        <CardDescription>
          Start, pause or end the competition
        </CardDescription>
        <CardContent className="mt-4 flex flex-wrap gap-3">
          <Button
            variant={settings.is_active === "true" ? "danger" : "primary"}
            onClick={() => handleToggle("is_active")}
            disabled={saving === "is_active"}
          >
            <Power className="h-4 w-4" />
            {settings.is_active === "true"
              ? "Stop Competition"
              : "Start Competition"}
          </Button>
          {settings.is_active === "true" && (
            <Button
              variant="secondary"
              onClick={() => handleToggle("is_paused")}
              disabled={saving === "is_paused"}
            >
              {settings.is_paused === "true" ? (
                <>
                  <Play className="h-4 w-4" /> Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              )}
            </Button>
          )}
          <Button
            variant={
              settings.leaderboard_frozen === "true" ? "secondary" : "outline"
            }
            onClick={() => handleToggle("leaderboard_frozen")}
            disabled={saving === "leaderboard_frozen"}
          >
            <Lock className="h-4 w-4" />
            {settings.leaderboard_frozen === "true"
              ? "Unfreeze Leaderboard"
              : "Freeze Leaderboard"}
          </Button>
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
                defaultValue={settings.start_time || ""}
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
                defaultValue={settings.end_time || ""}
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
