export interface Profile {
  id: string
  email: string
  display_name: string
  is_admin: boolean
  team_id: string | null
  created_at: string
}

export interface Team {
  id: string
  name: string
  invite_code: string
  captain_id: string
  created_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  joined_at: string
  profiles?: Profile
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  points: number
  flag_hash: string
  hint: string | null
  hint_penalty: number
  attachment_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  challenge_id: string
  team_id: string
  user_id: string
  submitted_flag: string
  is_correct: boolean
  created_at: string
  challenges?: Challenge
  profiles?: Profile
  teams?: Team
}

export interface Solve {
  id: string
  challenge_id: string
  team_id: string
  user_id: string
  points_awarded: number
  is_first_blood: boolean
  solved_at: string
  challenges?: Challenge
  teams?: Team
}

export interface HintUnlock {
  id: string
  challenge_id: string
  team_id: string
  unlocked_at: string
}

export interface CompetitionSetting {
  id: string
  key: string
  value: string
  updated_at: string
}

export type ChallengeCategory =
  | "web"
  | "crypto"
  | "forensics"
  | "osint"
  | "reverse"
  | "ai"

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert"

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  web: "Web Exploitation",
  crypto: "Cryptography",
  forensics: "Digital Forensics",
  osint: "OSINT",
  reverse: "Reverse Engineering",
  ai: "AI & Prompt Security",
}

export const DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
}

export const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-orange-400",
  expert: "text-red-400",
}

export interface LeaderboardEntry {
  rank: number
  team_id: string
  team_name: string
  total_points: number
  solves_count: number
  last_solve_time: string | null
  first_bloods: number
}

export interface CompetitionStatus {
  is_active: boolean
  is_paused: boolean
  leaderboard_frozen: boolean
  start_time: string | null
  end_time: string | null
  competition_name: string
  flag_format: string
  max_team_size: number
  min_team_size: number
}
