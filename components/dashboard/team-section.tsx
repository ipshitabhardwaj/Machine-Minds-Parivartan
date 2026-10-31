"use client"

import { useActionState, useState } from "react"
import { createTeam, joinTeam } from "@/app/actions/teams"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, UserPlus } from "lucide-react"

export function TeamSection({ maxTeamSize }: { maxTeamSize: number }) {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose")

  const [createState, createAction, createPending] = useActionState(
    createTeam,
    { error: null, success: false }
  )
  const [joinState, joinAction, joinPending] = useActionState(joinTeam, {
    error: null,
    success: false,
  })

  if (mode === "choose") {
    return (
      <Card className="max-w-lg mx-auto">
        <CardTitle>Join or Create a Team</CardTitle>
        <CardDescription>
          You need to be in a team to participate. Teams can have up to{" "}
          {maxTeamSize} members.
        </CardDescription>
        <CardContent className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setMode("create")}
            className="flex-1"
            variant="primary"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
          <Button
            onClick={() => setMode("join")}
            className="flex-1"
            variant="outline"
          >
            <UserPlus className="h-4 w-4" />
            Join Team
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (mode === "create") {
    return (
      <Card className="max-w-lg mx-auto">
        <CardTitle>Create a Team</CardTitle>
        <CardDescription>
          Choose a team name. You&apos;ll become the captain.
        </CardDescription>
        <CardContent className="mt-4">
          <form action={createAction} className="space-y-4">
            {createState.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {createState.error}
              </div>
            )}
            <div>
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                required
                minLength={3}
                maxLength={30}
                placeholder="Enter team name"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createPending}>
                {createPending ? "Creating..." : "Create Team"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode("choose")}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardTitle>Join a Team</CardTitle>
      <CardDescription>
        Enter the invite code shared by your team captain.
      </CardDescription>
      <CardContent className="mt-4">
        <form action={joinAction} className="space-y-4">
          {joinState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {joinState.error}
            </div>
          )}
          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              name="inviteCode"
              required
              maxLength={8}
              placeholder="e.g. AB3XY7KP"
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={joinPending}>
              {joinPending ? "Joining..." : "Join Team"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode("choose")}
            >
              Back
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
