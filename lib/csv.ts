// Pure helpers, safe to run in the browser and on the server.

export interface TeamRow {
  teamName: string
  member1: string
  member2: string
  college: string
  email1: string
  email2: string
}

/** Parse CSV or tab-separated text (Excel copy-paste gives tabs). */
export function parseDelimited(text: string): string[][] {
  const src = text.replace(/^﻿/, "")
  const firstLine = src.split(/\r?\n/, 1)[0] || ""
  const counts: Record<string, number> = {
    "\t": (firstLine.match(/\t/g) || []).length,
    ",": (firstLine.match(/,/g) || []).length,
    ";": (firstLine.match(/;/g) || []).length,
  }
  const delim = (Object.keys(counts) as string[]).sort((a, b) => counts[b] - counts[a])[0]
  const d = counts[delim] > 0 ? delim : ","

  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let inQuotes = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++ } else inQuotes = false
      } else cell += c
    } else if (c === '"') inQuotes = true
    else if (c === d) { row.push(cell); cell = "" }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++
      row.push(cell); cell = ""
      rows.push(row); row = []
    } else cell += c
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((x) => x.trim() !== ""))
}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, "")
const ALIASES = {
  team: ["team", "teamname", "squad", "squadname"],
  member1: ["member1", "member1name", "participant1", "participant1name", "name1", "player1", "student1", "leader", "teamleader", "captain", "membera"],
  member2: ["member2", "member2name", "participant2", "participant2name", "name2", "player2", "student2", "teammate", "partner", "memberb"],
  person: ["name", "fullname", "studentname", "participant", "participantname", "student"],
  college: ["college", "collegename", "institution", "institute", "university", "school", "organisation", "organization"],
  email1: ["email1", "member1email", "leaderemail", "captainemail", "email", "emailid", "emailaddress"],
  email2: ["email2", "member2email", "teammateemail", "partneremail"],
}

function findCol(headers: string[], names: string[]): number {
  return headers.findIndex((h) => names.includes(h))
}

export function rowsFromTable(table: string[][]): { rows: TeamRow[]; problems: string[] } {
  const problems: string[] = []
  if (table.length < 2) return { rows: [], problems: ["The sheet needs a header row and at least one team."] }

  const headers = table[0].map(norm)
  const c = {
    team: findCol(headers, ALIASES.team),
    m1: findCol(headers, ALIASES.member1),
    m2: findCol(headers, ALIASES.member2),
    person: findCol(headers, ALIASES.person),
    college: findCol(headers, ALIASES.college),
    e1: findCol(headers, ALIASES.email1),
    e2: findCol(headers, ALIASES.email2),
  }
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] || "").trim() : "")
  const body = table.slice(1)
  const rows: TeamRow[] = []

  if (c.m1 >= 0 && c.m2 >= 0) {
    // One row per team
    body.forEach((r, idx) => {
      const row: TeamRow = {
        teamName: get(r, c.team), member1: get(r, c.m1), member2: get(r, c.m2),
        college: get(r, c.college), email1: get(r, c.e1), email2: get(r, c.e2),
      }
      if (!row.member1 || !row.member2) problems.push(`Row ${idx + 2}: both member names are needed.`)
      else rows.push(row)
    })
  } else if (c.person >= 0 && c.team >= 0) {
    // One row per student, grouped by team name
    const groups = new Map<string, TeamRow & { n: number }>()
    body.forEach((r, idx) => {
      const team = get(r, c.team)
      const name = get(r, c.person)
      if (!team || !name) { problems.push(`Row ${idx + 2}: team and name are needed.`); return }
      const key = team.toLowerCase()
      const g = groups.get(key)
      if (!g) groups.set(key, { teamName: team, member1: name, member2: "", college: get(r, c.college), email1: get(r, c.e1), email2: "", n: 1 })
      else if (g.n === 1) { g.member2 = name; g.email2 = get(r, c.e1); g.n = 2 }
      else problems.push(`Team "${team}" has more than 2 students. Extra row ${idx + 2} ignored.`)
    })
    groups.forEach((g) => {
      if (g.n < 2) problems.push(`Team "${g.teamName}" has only one student.`)
      else rows.push({ teamName: g.teamName, member1: g.member1, member2: g.member2, college: g.college, email1: g.email1, email2: g.email2 })
    })
  } else {
    problems.push(
      "Could not find the columns. Use headers like: team, member1, member2, college (one row per team), or name, team, college (one row per student). Found: " +
        table[0].join(", ")
    )
  }
  return { rows, problems }
}

export function credentialsCsv(
  list: { code: string; password: string; teamName: string; member1: string; member2: string; college: string }[]
): string {
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)
  const head = "Team ID,Password,Team name,Member 1,Member 2,College"
  return [head, ...list.map((r) => [r.code, r.password, r.teamName, r.member1, r.member2, r.college].map(esc).join(","))].join("\n")
}
