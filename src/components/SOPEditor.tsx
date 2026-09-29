'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

interface SOPAnalysis {
  structure: number
  clarity: number
  voice: number
  aiDetection: number
  overallScore: number
  strengths: string[]
  improvements: string[]
  flaggedPassages: string[]
  rewriteSuggestion: string
  truncated?: boolean
}

const MAX_SOP_CHARS = 12000

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const pct = (score / 10) * 100
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          className="transition-all duration-700"
        />
        <text x="36" y="41" textAnchor="middle" className="fill-white font-bold" fontSize="14">
          {score.toFixed(1)}
        </text>
      </svg>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}

export default function SOPEditor() {
  const [sop, setSop] = useState('')
  const [result, setResult] = useState<SOPAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyze() {
    if (sop.trim().length < 50) {
      setError('Please paste at least 50 characters of your SOP.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze-sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sop }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const aiRisk = result
    ? result.aiDetection > 70 ? 'high' : result.aiDetection > 40 ? 'medium' : 'low'
    : null

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Paste your SOP below
        </label>
        <textarea
          value={sop}
          onChange={e => setSop(e.target.value)}
          placeholder="My interest in computer science began when I was 15..."
          rows={10}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <span className={sop.length > MAX_SOP_CHARS ? 'text-amber-400' : ''}>
            {sop.length.toLocaleString()} / {MAX_SOP_CHARS.toLocaleString()} characters
          </span>
          <span>Recommended: 500–1,000 words</span>
        </div>
        {sop.length > MAX_SOP_CHARS && (
          <p className="mt-2 text-xs text-amber-400">
            Your SOP is longer than ~2,000 words. Only the first {MAX_SOP_CHARS.toLocaleString()} characters will be analyzed — most SOPs should be under 1,200 words.
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={analyze}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your SOP...
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4" /> Analyze SOP
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-up">
          {result.truncated && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              Only the first ~2,000 words were analyzed. Feedback may miss content after that point.
            </div>
          )}

          {/* Score rings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Score Breakdown
            </h3>
            <div className="flex flex-wrap justify-around gap-4">
              <ScoreRing score={result.overallScore} label="Overall" color="#10b981" />
              <ScoreRing score={result.structure} label="Structure" color="#6366f1" />
              <ScoreRing score={result.clarity} label="Clarity" color="#06b6d4" />
              <ScoreRing score={result.voice} label="Voice" color="#f59e0b" />
            </div>
          </div>

          {/* AI detection */}
          <div className={`rounded-2xl border p-5 ${
            aiRisk === 'high' ? 'border-red-500/30 bg-red-500/10' :
            aiRisk === 'medium' ? 'border-amber-500/30 bg-amber-500/10' :
            'border-emerald-500/30 bg-emerald-500/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">AI Detection Score</span>
              <span className={`text-2xl font-bold ${
                aiRisk === 'high' ? 'text-red-400' :
                aiRisk === 'medium' ? 'text-amber-400' :
                'text-emerald-400'
              }`}>
                {result.aiDetection}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  aiRisk === 'high' ? 'bg-red-500' :
                  aiRisk === 'medium' ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${result.aiDetection}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {aiRisk === 'high' && 'High AI detection — universities may flag this. Rewrite flagged passages in your own voice.'}
              {aiRisk === 'medium' && 'Moderate AI content detected. Review flagged passages and personalise them.'}
              {aiRisk === 'low' && 'Looks authentic! Your voice comes through well.'}
            </p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="mb-3 text-sm font-semibold text-emerald-400">What&apos;s working</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="mb-3 text-sm font-semibold text-amber-400">Improvements needed</h3>
              <ul className="space-y-2">
                {result.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Flagged passages */}
          {result.flaggedPassages.length > 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="mb-3 text-sm font-semibold text-red-400">Rewrite these passages (sound AI-generated)</h3>
              <ul className="space-y-2">
                {result.flaggedPassages.map((p, i) => (
                  <li key={i} className="rounded-lg bg-red-500/10 px-3 py-2 text-sm italic text-slate-300">
                    &ldquo;{p}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewrite suggestion */}
          {result.rewriteSuggestion && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <h3 className="mb-3 text-sm font-semibold text-violet-400">Suggested rewrite</h3>
              <p className="text-sm leading-relaxed text-slate-300">{result.rewriteSuggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
