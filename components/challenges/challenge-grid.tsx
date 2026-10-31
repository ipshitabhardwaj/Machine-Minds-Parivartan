"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  type ChallengeCategory,
  type ChallengeDifficulty,
} from "@/types"
import { CheckCircle, Flame } from "lucide-react"

interface ChallengeItem {
  id: string
  title: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  points: number
}

interface Props {
  challenges: ChallengeItem[]
  solvedIds: string[]
  firstBloods: Record<string, string>
  hasTeam: boolean
}

const categories: (ChallengeCategory | "all")[] = [
  "all",
  "web",
  "crypto",
  "forensics",
  "osint",
  "reverse",
  "ai",
]

export function ChallengeGrid({
  challenges,
  solvedIds,
  firstBloods,
  hasTeam,
}: Props) {
  const [filter, setFilter] = useState<ChallengeCategory | "all">("all")

  const filtered =
    filter === "all"
      ? challenges
      : challenges.filter((c) => c.category === filter)

  return (
    <div>
      {!hasTeam && (
        <div className="mb-6 p-4 rounded-lg border border-yellow-800 bg-yellow-950/30 text-yellow-400 text-sm">
          You must join or create a team before submitting flags.
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === cat
                ? "bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/30"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((challenge) => {
          const solved = solvedIds.includes(challenge.id)
          const fb = firstBloods[challenge.id]
          return (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className={`block p-5 rounded-xl border transition-all group ${
                solved
                  ? "border-green-800/50 bg-green-950/20 hover:border-green-700"
                  : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-accent)]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline">
                  {CATEGORY_LABELS[challenge.category]}
                </Badge>
                {solved && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-green)] transition-colors">
                {challenge.title}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    DIFFICULTY_COLORS[challenge.difficulty]
                  }`}
                >
                  {DIFFICULTY_LABELS[challenge.difficulty]}
                </span>
                <span className="text-[var(--accent-green)] font-mono font-bold">
                  {challenge.points} pts
                </span>
              </div>
              {fb && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[var(--accent-coral)]">
                  <Flame className="h-3 w-3" />
                  First blood: {fb}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-12">
          No challenges in this category yet.
        </p>
      )}
    </div>
  )
}
