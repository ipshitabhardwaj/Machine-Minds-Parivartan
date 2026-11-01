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
import { CheckCircle, Flame, ChevronRight } from "lucide-react"

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
  "misc",
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
        <div className="mb-6 p-4 border border-yellow-800/40 bg-yellow-950/20 text-yellow-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400/60 shrink-0" />
          You must join or create a team before submitting flags.
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1 mb-8 p-1 bg-[var(--bg-card)] border border-[var(--border-primary)] w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer ${
              filter === cat
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {filtered.map((challenge) => {
          const solved = solvedIds.includes(challenge.id)
          const fb = firstBloods[challenge.id]
          return (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className={`group block p-5 border transition-colors card-lift ${
                solved
                  ? "border-green-800/30 bg-green-950/10 hover:border-green-700/40"
                  : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline">
                  {CATEGORY_LABELS[challenge.category]}
                </Badge>
                <div className="flex items-center gap-2">
                  {solved && (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              <h3 className="font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {challenge.title}
              </h3>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    DIFFICULTY_COLORS[challenge.difficulty]
                  }`}
                >
                  {DIFFICULTY_LABELS[challenge.difficulty]}
                </span>
                <span className="text-[var(--accent)] font-mono font-black text-lg">
                  {challenge.points}
                  <span className="text-xs text-[var(--text-muted)] ml-0.5">pts</span>
                </span>
              </div>
              {fb && (
                <div className="mt-3 pt-3 border-t border-[var(--border-primary)] flex items-center gap-1.5 text-xs text-[var(--accent-coral)]">
                  <Flame className="h-3 w-3" />
                  First blood: {fb}
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)] font-mono text-sm">
            {">"} No challenges in this category yet
          </p>
        </div>
      )}
    </div>
  )
}
