"use client"

import { useState } from "react"
import { createTeamsBatch, type CreatedTeam } from "@/app/actions/admin"
import { parseDelimited, rowsFromTable, credentialsCsv, type TeamRow } from "@/lib/csv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Download, Plus, Trash2, Upload } from "lucide-react"

const BATCH = 10

const EMPTY: TeamRow = { teamName: "", member1: "", member2: "", college: "", email1: "", email2: "" }

export function ImportTeams() {
  const [rows, setRows] = useState<TeamRow[]>([])
  const [problems, setProblems] = useState<string[]>([])
  const [pasted, setPasted] = useState("")
  const [manual, setManual] = useState<TeamRow>(EMPTY)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState("")
  const [results, setResults] = useState<CreatedTeam[]>([])
  const [fatal, setFatal] = useState<string | null>(null)

  function load(text: string) {
    if (text.startsWith("PK")) {
      setProblems(["That looks like an .xlsx file. In Excel choose File > Save As > CSV, or copy the cells and paste them below."])
      return
    }
    const { rows: parsed, problems: p } = rowsFromTable(parseDelimited(text))
    setRows((prev) => [...prev, ...parsed])
    setProblems(p)
  }

  async function onFile(f: File | undefined) {
    if (!f) return
    load(await f.text())
  }

  function addManual() {
    if (!manual.member1.trim() || !manual.member2.trim()) {
      setProblems(["Enter both member names."])
      return
    }
    setRows((prev) => [...prev, manual])
    setManual(EMPTY)
    setProblems([])
  }

  async function createAll() {
    setBusy(true)
    setFatal(null)
    const all: CreatedTeam[] = []
    for (let i = 0; i < rows.length; i += BATCH) {
      setProgress(`Creating teams ${i + 1}-${Math.min(i + BATCH, rows.length)} of ${rows.length}`)
      const res = await createTeamsBatch(rows.slice(i, i + BATCH))
      if (res.error) {
        setFatal(res.error)
        break
      }
      all.push(...res.results)
      setResults([...all])
    }
    setProgress("")
    setBusy(false)
    setRows([])
  }

  function download() {
    const ok = results.filter((r) => r.ok) as (CreatedTeam & { code: string; password: string })[]
    const blob = new Blob([credentialsCsv(ok.map((r) => ({ ...r, teamName: r.teamName })))], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "machine-minds-team-logins.csv"
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const okCount = results.filter((r) => r.ok).length

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>1. Load teams</CardTitle>
        <CardContent className="mt-4 space-y-5">
          <div>
            <Label htmlFor="csv">CSV file</Label>
            <input
              id="csv"
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => onFile(e.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:border file:border-[var(--line)] file:bg-[var(--bg-secondary)] file:px-3 file:py-2 file:font-mono file:text-[var(--text-primary)]"
            />
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              Headers: <code>team, member1, member2, college</code> (one row per team),
              or <code>name, team, college</code> (one row per student, two students per team).
              Optional: <code>email1, email2</code>.
            </p>
          </div>

          <div>
            <Label htmlFor="paste">Or paste from Excel</Label>
            <textarea
              id="paste"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={5}
              className="w-full border border-[var(--border-primary)] bg-[var(--bg-input)] p-3 font-mono text-xs"
              placeholder="Paste the rows here, with the header row first"
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => {
                load(pasted)
                setPasted("")
              }}
              disabled={!pasted.trim()}
            >
              <Upload className="h-4 w-4" /> Read pasted sheet
            </Button>
          </div>

          <div>
            <p className="text-sm font-bold mb-2">Or add one team by hand</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Team name (optional)" value={manual.teamName} onChange={(e) => setManual({ ...manual, teamName: e.target.value })} />
              <Input placeholder="College" value={manual.college} onChange={(e) => setManual({ ...manual, college: e.target.value })} />
              <Input placeholder="Member 1 name" value={manual.member1} onChange={(e) => setManual({ ...manual, member1: e.target.value })} />
              <Input placeholder="Member 2 name" value={manual.member2} onChange={(e) => setManual({ ...manual, member2: e.target.value })} />
            </div>
            <Button variant="secondary" size="sm" className="mt-3" onClick={addManual}>
              <Plus className="h-4 w-4" /> Add team to list
            </Button>
          </div>

          {problems.length > 0 && (
            <ul className="border border-[var(--accent-coral)]/50 bg-[var(--accent-coral)]/10 p-3 text-sm space-y-1">
              {problems.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Card>
          <CardTitle>2. Check and create ({rows.length} teams)</CardTitle>
          <CardContent className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left font-mono text-xs text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-2 pr-3">Team</th>
                    <th className="pr-3">Member 1</th>
                    <th className="pr-3">Member 2</th>
                    <th className="pr-3">College</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      <td className="py-2 pr-3">{r.teamName || <span className="text-[var(--text-muted)]">auto</span>}</td>
                      <td className="pr-3">{r.member1}</td>
                      <td className="pr-3">{r.member2}</td>
                      <td className="pr-3">{r.college}</td>
                      <td>
                        <button
                          aria-label={`Remove ${r.member1}'s team from the list`}
                          onClick={() => setRows(rows.filter((_, j) => j !== i))}
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-coral)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={createAll} disabled={busy}>
                {busy ? "Creating..." : `Create ${rows.length} team${rows.length > 1 ? "s" : ""}`}
              </Button>
              <Button variant="ghost" onClick={() => setRows([])} disabled={busy}>
                Clear list
              </Button>
              {progress && <span className="font-mono text-xs text-[var(--text-secondary)]">{progress}</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {fatal && (
        <p className="border border-[var(--accent-coral)]/50 bg-[var(--accent-coral)]/10 p-3 text-sm">{fatal}</p>
      )}

      {results.length > 0 && (
        <Card>
          <CardTitle>3. Logins ({okCount} created)</CardTitle>
          <CardContent className="mt-4">
            <p className="text-sm mb-3 text-[var(--accent)]">
              Download this list now. Passwords are not stored in a readable form and cannot be shown again
              (you can reset a team&apos;s password from the Teams page).
            </p>
            <Button onClick={download} disabled={okCount === 0}>
              <Download className="h-4 w-4" /> Download logins (CSV)
            </Button>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left font-mono text-xs text-[var(--text-secondary)]">
                  <tr>
                    <th className="py-2 pr-3">Team ID</th>
                    <th className="pr-3">Password</th>
                    <th className="pr-3">Team</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t border-[var(--line)]">
                      {r.ok ? (
                        <>
                          <td className="py-2 pr-3 font-mono font-bold text-[var(--accent)]">{r.code}</td>
                          <td className="pr-3 font-mono">{r.password}</td>
                          <td className="pr-3">{r.teamName}</td>
                          <td>{r.member1} and {r.member2}</td>
                        </>
                      ) : (
                        <td colSpan={4} className="py-2 text-[var(--accent-coral)]">
                          {r.member1} and {r.member2}: {r.error}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
