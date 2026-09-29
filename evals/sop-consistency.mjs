// SOP Editor consistency eval.
// Sends each sample SOP to the real /api/analyze-sop route several times and checks:
//   1. Consistency — does the same essay get the same scores?
//   2. Ranking    — does strong > average > weak?
//   3. Full read  — for long.txt, does feedback ask for things already in its second half?
// Usage: start the app (`npm run dev`), then `node evals/sop-consistency.mjs [runs]`

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const BASE_URL = process.env.GRADOS_URL ?? 'http://localhost:3000'
const RUNS = Number(process.argv[2] ?? 5)
const SAMPLES = ['strong', 'average', 'weak', 'long']
const METRICS = ['overallScore', 'structure', 'clarity', 'voice', 'aiDetection']

// long.txt already covers these in its second half (after char 3000). Advice asking for them
// means the model didn't read the whole essay. Keyword heuristic — review hits by hand.
const ALREADY_IN_LONG = [
  /future (research )?goals?|long[- ]term|career goals?/i,
  /broader (social )?impact|impact beyond/i,
  /faculty|professor|why (cmu|carnegie|this (program|university))|program fit/i,
  /work experience|professional experience/i,
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function analyze(sop) {
  const res = await fetch(`${BASE_URL}/api/analyze-sop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sop }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

function stats(values) {
  const n = values.length
  if (n === 0) return null
  const mean = values.reduce((a, b) => a + b, 0) / n
  const sd = Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / n)
  return { mean: +mean.toFixed(2), min: Math.min(...values), max: Math.max(...values), spread: Math.max(...values) - Math.min(...values), sd: +sd.toFixed(2) }
}

const results = {}
for (const name of SAMPLES) {
  const sop = readFileSync(join(here, 'samples', `${name}.txt`), 'utf8')
  results[name] = { chars: sop.length, runs: [], errors: [] }
  for (let i = 0; i < RUNS; i++) {
    try {
      const out = await analyze(sop)
      results[name].runs.push(out)
      process.stdout.write(`${name} run ${i + 1}: overall=${out.overallScore} ai=${out.aiDetection}%\n`)
    } catch (err) {
      results[name].errors.push(String(err.message))
      process.stdout.write(`${name} run ${i + 1}: ERROR ${err.message}\n`)
    }
    await sleep(1500) // stay under Groq free-tier rate limits
  }
}

// Consistency table
console.log('\n=== CONSISTENCY (same essay, repeated runs) ===')
const summary = {}
for (const name of SAMPLES) {
  summary[name] = {}
  for (const m of METRICS) {
    const vals = results[name].runs.map((r) => Number(r[m])).filter((v) => !Number.isNaN(v))
    summary[name][m] = { values: vals, ...stats(vals) }
  }
}
for (const m of METRICS) {
  console.log(`\n${m}`)
  for (const name of SAMPLES) {
    const s = summary[name][m]
    if (!s.values.length) { console.log(`  ${name.padEnd(8)} no data`); continue }
    console.log(`  ${name.padEnd(8)} values=[${s.values.join(', ')}]  mean=${s.mean}  spread=${s.spread}`)
  }
}

// Ranking check on overallScore means
console.log('\n=== RANKING (expected strong > average > weak) ===')
const means = Object.fromEntries(SAMPLES.map((n) => [n, summary[n].overallScore.mean]))
console.log(`  means: strong=${means.strong}  average=${means.average}  weak=${means.weak}`)
const rankingOk = means.strong > means.average && means.average > means.weak
console.log(`  ranking correct: ${rankingOk ? 'YES' : 'NO'}`)

// Per-run ranking: how often does a single run order them correctly?
let correctRuns = 0
const paired = Math.min(...SAMPLES.map((n) => results[n].runs.length))
for (let i = 0; i < paired; i++) {
  const [s, a, w] = SAMPLES.map((n) => Number(results[n].runs[i].overallScore))
  if (s > a && a > w) correctRuns++
}
console.log(`  single-run ranking correct: ${correctRuns}/${paired}`)

// Full-read check on long.txt
console.log('\n=== FULL READ (long.txt: advice asking for content it already has) ===')
let redundant = 0
for (const run of results.long.runs) {
  for (const tip of run.improvements ?? []) {
    if (ALREADY_IN_LONG.some((re) => re.test(tip))) {
      redundant++
      console.log(`  ⚠ "${tip}"`)
    }
  }
}
console.log(`  redundant suggestions: ${redundant} across ${results.long.runs.length} runs ${redundant === 0 ? '✅' : '❌'}`)
console.log(`  long.txt mean overall=${summary.long.overallScore.mean} (strong.txt=${summary.strong.overallScore.mean})`)

const errorCount = SAMPLES.reduce((a, n) => a + results[n].errors.length, 0)
console.log(`\nErrors: ${errorCount}/${RUNS * SAMPLES.length} requests failed`)

mkdirSync(join(here, 'results'), { recursive: true })
const file = join(here, 'results', `sop-consistency-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
writeFileSync(file, JSON.stringify({ runs: RUNS, summary, means, rankingOk, correctRuns, redundant, results }, null, 2))
console.log(`\nFull results saved to ${file}`)
