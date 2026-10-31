import { notFound } from "next/navigation"
import Link from "next/link"
import { requireAuth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  type ChallengeCategory,
  type ChallengeDifficulty,
} from "@/types"
import { FlagSubmission } from "@/components/challenges/flag-submission"
import { HintButton } from "@/components/challenges/hint-button"
import { ArrowLeft, Flame, Download, CheckCircle } from "lucide-react"
import Markdown from "react-markdown"

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await requireAuth()
  const admin = createAdminClient()

  const { data: challenge } = await admin
    .from("challenges")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!challenge) notFound()

  let solved = false
  let hintUnlocked = false
  let solveCount = 0
  let firstBloodTeam: string | null = null

  if (profile.team_id) {
    const { data: solve } = await admin
      .from("solves")
      .select("id")
      .eq("challenge_id", id)
      .eq("team_id", profile.team_id)
      .single()
    solved = !!solve

    const { data: hint } = await admin
      .from("hint_unlocks")
      .select("id")
      .eq("challenge_id", id)
      .eq("team_id", profile.team_id)
      .single()
    hintUnlocked = !!hint
  }

  const { count } = await admin
    .from("solves")
    .select("*", { count: "exact", head: true })
    .eq("challenge_id", id)
  solveCount = count || 0

  const { data: firstBlood } = await admin
    .from("solves")
    .select("teams(name)")
    .eq("challenge_id", id)
    .eq("is_first_blood", true)
    .single()

  if (firstBlood) {
    const teamArr = firstBlood.teams as unknown as { name: string }[] | null
    firstBloodTeam = teamArr?.[0]?.name || null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/challenges"
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Challenges
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline">
            {CATEGORY_LABELS[challenge.category as ChallengeCategory]}
          </Badge>
          <Badge
            variant={
              challenge.difficulty === "easy"
                ? "success"
                : challenge.difficulty === "medium"
                  ? "warning"
                  : "danger"
            }
          >
            {DIFFICULTY_LABELS[challenge.difficulty as ChallengeDifficulty]}
          </Badge>
          <span className="text-[var(--accent-green)] font-mono font-bold text-lg ml-auto">
            {challenge.points} pts
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {challenge.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <span>{solveCount} solve{solveCount !== 1 ? "s" : ""}</span>
          {firstBloodTeam && (
            <span className="flex items-center gap-1 text-[var(--accent-coral)]">
              <Flame className="h-3.5 w-3.5" />
              First blood: {firstBloodTeam}
            </span>
          )}
          {solved && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Solved
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-invert prose-sm max-w-none mb-8 p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] [&_pre]:bg-[var(--bg-primary)] [&_pre]:border [&_pre]:border-[var(--border-primary)] [&_pre]:rounded-lg [&_code]:text-[var(--accent-green)] [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_a]:text-[var(--accent-green)]">
        <Markdown>{challenge.description}</Markdown>
      </div>

      {/* Attachment */}
      {challenge.attachment_url && (
        <a
          href={challenge.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Attachment
        </a>
      )}

      {/* Hint */}
      {challenge.hint && (
        <div className="mb-6">
          <HintButton
            challengeId={challenge.id}
            hintPenalty={challenge.hint_penalty}
            initialUnlocked={hintUnlocked}
            hint={hintUnlocked ? challenge.hint : null}
          />
        </div>
      )}

      {/* Flag Submission */}
      {!solved && profile.team_id && (
        <FlagSubmission challengeId={challenge.id} />
      )}

      {solved && (
        <div className="p-4 rounded-xl border border-green-800/50 bg-green-950/20 text-center">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-medium">
            Your team has solved this challenge!
          </p>
        </div>
      )}

      {!profile.team_id && (
        <div className="p-4 rounded-xl border border-yellow-800 bg-yellow-950/30 text-center text-yellow-400 text-sm">
          Join or create a team to submit flags.
        </div>
      )}
    </div>
  )
}
