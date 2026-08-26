'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle, ExternalLink } from 'lucide-react'

interface University {
  name: string
  country: string
  program: string
  acceptanceChance: number
  tier: 'Safety' | 'Target' | 'Reach' | 'Dream'
  avgTuition: number
  avgGPA: string
  avgGRE: string
  highlights: string
  postStudyWork: string
}

const tierColors: Record<string, string> = {
  Safety: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Target: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Reach: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Dream: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
}

const countries = ['USA', 'Canada', 'UK', 'Germany', 'Singapore', 'Australia', 'Netherlands', 'France']
const fields = [
  'Computer Science', 'Data Science', 'AI / Machine Learning', 'Electrical Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'MBA / Business', 'Finance',
  'Biotechnology', 'Physics', 'Mathematics', 'Public Policy',
]

export default function UniversityMatcher() {
  const [form, setForm] = useState({
    gpa: '', gre: '', greVerbal: '', budget: '30000',
    country: 'USA', field: 'Computer Science', workExp: '0',
  })
  const [results, setResults] = useState<University[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function match() {
    if (!form.gpa) { setError('GPA is required.'); return }
    setLoading(true); setError(''); setResults(null)

    try {
      const res = await fetch('/api/match-universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setResults(data.universities)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">GPA (out of 10) *</label>
            <input
              type="number"
              min="0" max="10" step="0.1"
              placeholder="e.g. 8.2"
              value={form.gpa}
              onChange={e => set('gpa', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">GRE Total (optional)</label>
            <input
              type="number"
              min="260" max="340"
              placeholder="e.g. 320"
              value={form.gre}
              onChange={e => set('gre', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Work Experience (years)</label>
            <input
              type="number"
              min="0" max="20"
              placeholder="0"
              value={form.workExp}
              onChange={e => set('workExp', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Annual Tuition Budget (USD)</label>
            <input
              type="number"
              min="5000"
              placeholder="30000"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Preferred Country *</label>
            <select
              value={form.country}
              onChange={e => set('country', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Field of Study *</label>
            <select
              value={form.field}
              onChange={e => set('field', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {fields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={match}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Finding your universities...</>
        ) : (
          'Find My Best Universities'
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-fade-up">
          <p className="text-sm text-slate-400">{results.length} universities matched — sorted by acceptance chance</p>
          {[...results]
            .sort((a, b) => b.acceptanceChance - a.acceptanceChance)
            .map((uni, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tierColors[uni.tier] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        {uni.tier}
                      </span>
                      <span className="text-xs text-slate-500">{uni.country}</span>
                    </div>
                    <h3 className="font-semibold text-white truncate">{uni.name}</h3>
                    <p className="text-sm text-slate-400">{uni.program}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-white">{uni.acceptanceChance}%</div>
                    <div className="text-xs text-slate-500">chance</div>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${uni.acceptanceChance}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-3">
                  <span>Tuition: <span className="text-slate-200">${uni.avgTuition?.toLocaleString()}/yr</span></span>
                  <span>Avg GPA: <span className="text-slate-200">{uni.avgGPA}</span></span>
                  <span>GRE: <span className="text-slate-200">{uni.avgGRE}</span></span>
                </div>

                <p className="mt-2 text-xs text-slate-400">{uni.highlights}</p>
                <p className="mt-1 text-xs text-sky-400">{uni.postStudyWork}</p>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(uni.name + ' ' + uni.program + ' admissions')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                >
                  View admission details <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
