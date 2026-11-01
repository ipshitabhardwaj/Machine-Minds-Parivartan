import { Crown, Medal, Flame } from "lucide-react"

export interface PodiumTeam {
  rank: number
  team_name: string
  college: string | null
  total_points: number
  solves_count: number
  first_bloods: number
}

const PRIZE: Record<number, string> = { 1: "₹8,000", 2: "₹6,000", 3: "₹4,000" }

const STYLE: Record<number, { h: string; ring: string; text: string; label: string }> = {
  1: { h: "sm:h-52", ring: "border-yellow-400/60", text: "text-yellow-300", label: "1ST" },
  2: { h: "sm:h-40", ring: "border-slate-300/50", text: "text-slate-200", label: "2ND" },
  3: { h: "sm:h-32", ring: "border-orange-400/50", text: "text-orange-300", label: "3RD" },
}

function Column({ t }: { t: PodiumTeam }) {
  const st = STYLE[t.rank]
  return (
    <div className="flex flex-col items-center justify-end flex-1 min-w-0">
      <div className="mb-3 text-center px-1 w-full">
        {t.rank === 1 ? (
          <Crown className={`h-8 w-8 mx-auto mb-1 ${st.text}`} />
        ) : (
          <Medal className={`h-6 w-6 mx-auto mb-1 ${st.text}`} />
        )}
        <p className="font-black text-base sm:text-lg truncate">{t.team_name}</p>
        {t.college && (
          <p className="text-[11px] text-[var(--text-secondary)] truncate">{t.college}</p>
        )}
        {t.first_bloods > 0 && (
          <p className="text-[11px] text-[var(--accent-coral)] flex items-center justify-center gap-1 mt-0.5">
            <Flame className="h-3 w-3" />
            {t.first_bloods} first blood{t.first_bloods > 1 ? "s" : ""}
          </p>
        )}
      </div>
      <div
        className={`w-full border bg-[var(--bg-card)] ${st.ring} ${st.h} h-24 flex flex-col items-center justify-center`}
      >
        <span className={`font-mono text-xs tracking-[0.3em] ${st.text}`}>{st.label}</span>
        <span className="font-mono text-2xl sm:text-3xl font-black tabular-nums">
          {t.total_points}
        </span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          pts · {t.solves_count} solved
        </span>
        <span className={`mt-1 font-mono text-xs font-bold ${st.text}`}>
          Prize {PRIZE[t.rank]}
        </span>
      </div>
    </div>
  )
}

export function Podium({ teams }: { teams: PodiumTeam[] }) {
  const byRank = (r: number) => teams.find((t) => t.rank === r)
  const order = [byRank(2), byRank(1), byRank(3)].filter(Boolean) as PodiumTeam[]
  if (order.length === 0) return null
  return (
    <div className="cyber-panel p-6 sm:p-8 mb-8">
      <p className="font-mono text-xs tracking-[0.3em] text-[var(--accent)] text-center mb-1">
        {">"} FINAL_RESULTS
      </p>
      <h2 className="text-center font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight mb-8">
        MACHINE MINDS <span className="text-[var(--accent)]">CHAMPIONS</span>
      </h2>
      <div className="flex items-end gap-2 sm:gap-4 max-w-2xl mx-auto">
        {order.map((t) => (
          <Column key={t.rank} t={t} />
        ))}
      </div>
    </div>
  )
}
