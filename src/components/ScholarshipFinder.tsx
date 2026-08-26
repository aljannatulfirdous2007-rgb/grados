'use client'

import { useState } from 'react'
import { ExternalLink, Award, Filter } from 'lucide-react'

interface Scholarship {
  name: string
  country: string
  amount: string
  fullTuition: boolean
  stipend: boolean
  eligibility: string
  deadline: string
  gpaMin: number
  fields: string[]
  link: string
  highlight?: string
}

const scholarships: Scholarship[] = [
  { name: 'DAAD Scholarship', country: 'Germany', amount: '€861/month + tuition waiver', fullTuition: true, stipend: true, eligibility: 'GPA 7.5+/10, any field, Bachelor\'s completed', deadline: 'Oct 15 annually', gpaMin: 7.5, fields: ['All'], link: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', highlight: 'Most popular for Indian students to Germany' },
  { name: 'NUS Research Scholarship', country: 'Singapore', amount: 'Full tuition + SGD $2,000/month', fullTuition: true, stipend: true, eligibility: 'GPA 8.5+/10, STEM fields, research aptitude', deadline: 'Jan 1 for Aug intake', gpaMin: 8.5, fields: ['CS', 'Engineering', 'Science'], link: 'https://nusgs.nus.edu.sg/scholarships/', highlight: 'Covers everything — tuition, living, insurance' },
  { name: 'NTU Research Scholarship', country: 'Singapore', amount: 'Full tuition + SGD $2,000/month', fullTuition: true, stipend: true, eligibility: 'GPA 8.0+/10, STEM focus, strong research background', deadline: 'Feb 15 annually', gpaMin: 8.0, fields: ['CS', 'Engineering', 'Science'], link: 'https://www.ntu.edu.sg/admissions/graduate/financialmatters/scholarships', highlight: 'NTU ranks #1 in Asia — excellent ROI' },
  { name: 'Vanier Canada Graduate Scholarship', country: 'Canada', amount: 'CAD $50,000/year for 3 years', fullTuition: false, stipend: true, eligibility: 'GPA 9.0+/10, PhD only, leadership potential', deadline: 'Nov 1 annually', gpaMin: 9.0, fields: ['All'], link: 'https://vanier.gc.ca/', highlight: 'Most prestigious Canadian scholarship' },
  { name: 'Fulbright-Nehru Master\'s Fellowships', country: 'USA', amount: 'Full tuition + living + airfare', fullTuition: true, stipend: true, eligibility: 'GPA 8.0+/10, Indian citizen, 3 years work exp, non-STEM preferred', deadline: 'Jul 15 annually', gpaMin: 8.0, fields: ['Arts', 'Social Science', 'Policy', 'Education'], link: 'https://www.usief.org.in/', highlight: 'India-specific Fulbright — free US master\'s' },
  { name: 'Erasmus Mundus Scholarship', country: 'Europe', amount: '€1,400/month + tuition waiver', fullTuition: true, stipend: true, eligibility: 'GPA 7.5+/10, any field, study at 2+ European universities', deadline: 'Jan–Feb (varies by program)', gpaMin: 7.5, fields: ['All'], link: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus_en', highlight: 'Study in 2–3 European countries' },
  { name: 'Chevening Scholarship', country: 'UK', amount: 'Full tuition + £1,347/month living', fullTuition: true, stipend: true, eligibility: 'GPA 7.0+/10, 2 years work exp, leadership, return to India after', deadline: 'Nov 5 annually', gpaMin: 7.0, fields: ['All'], link: 'https://www.chevening.org/', highlight: 'UK Government scholarship — very prestigious' },
  { name: 'Commonwealth Scholarships', country: 'UK', amount: 'Full tuition + £1,347/month', fullTuition: true, stipend: true, eligibility: 'GPA 7.5+/10, development impact focus, Indian citizen', deadline: 'Dec 15 annually', gpaMin: 7.5, fields: ['Development', 'STEM', 'Health'], link: 'https://cscuk.fcdo.gov.uk/apply/', highlight: 'For students whose study will benefit India' },
  { name: 'University of Toronto Fellowship', country: 'Canada', amount: 'CAD $15,000–25,000/year', fullTuition: false, stipend: true, eligibility: 'GPA 8.0+/10, PhD students, merit-based', deadline: 'Varies by department', gpaMin: 8.0, fields: ['All'], link: 'https://www.sgs.utoronto.ca/awards/', highlight: 'Automatic consideration on PhD application' },
  { name: 'UBC Graduate Scholarship', country: 'Canada', amount: 'CAD $16,000–22,000/year', fullTuition: false, stipend: true, eligibility: 'GPA 8.5+/10, Masters/PhD, all fields', deadline: 'Varies by program', gpaMin: 8.5, fields: ['All'], link: 'https://www.grad.ubc.ca/scholarships-awards-funding', highlight: 'UBC is top 40 global — strong ROI in Canada' },
  { name: 'ETH Zurich Excellence Scholarship', country: 'Switzerland', amount: 'CHF 12,000/semester + tuition', fullTuition: true, stipend: true, eligibility: 'GPA 9.0+/10, top 10% of class, any Masters', deadline: 'Dec 15 annually', gpaMin: 9.0, fields: ['STEM', 'Architecture'], link: 'https://ethz.ch/en/studies/financial/scholarships/excellence-scholarship.html', highlight: 'ETH ranks #7 globally — near MIT caliber' },
  { name: 'Gates Cambridge Scholarship', country: 'UK', amount: 'Full tuition + living + development fund', fullTuition: true, stipend: true, eligibility: 'GPA 9.0+/10, any field, leadership + social impact', deadline: 'Oct 12 annually', gpaMin: 9.0, fields: ['All'], link: 'https://www.gatescambridge.org/', highlight: 'Most competitive UK scholarship — like a Rhodes' },
  { name: 'MEXT Japanese Government Scholarship', country: 'Japan', amount: 'Full tuition + ¥144,000/month', fullTuition: true, stipend: true, eligibility: 'GPA 7.5+/10, any field, under 35', deadline: 'May annually (Embassy)', gpaMin: 7.5, fields: ['All'], link: 'https://www.studyinjapan.go.jp/en/planning/scholarship/', highlight: 'Japan is rising as a destination for Indian students' },
  { name: 'Inlaks Shivdasani Foundation', country: 'USA/UK/Europe', amount: 'Up to $100,000 over 2 years', fullTuition: false, stipend: true, eligibility: 'Indian citizen under 30, exceptional academic record', deadline: 'Apr 15 annually', gpaMin: 8.5, fields: ['All'], link: 'https://www.inlaksfoundation.org/', highlight: 'India-based foundation — specifically for Indian students abroad' },
  { name: 'Tata Scholarship (Cornell)', country: 'USA', amount: 'Full financial aid for 4 years', fullTuition: true, stipend: false, eligibility: 'Undergraduate (not MS), exceptional merit, from India', deadline: 'Jan 2 (Cornell application deadline)', gpaMin: 9.0, fields: ['All'], link: 'https://tata.cornell.edu/', highlight: 'Full ride at Cornell for Indian undergrads' },
]

const allCountries = ['All', ...Array.from(new Set(scholarships.map(s => s.country)))]
const allFields = ['All', 'CS', 'Engineering', 'Science', 'STEM', 'Arts', 'Social Science', 'Business', 'Policy']

export default function ScholarshipFinder() {
  const [country, setCountry] = useState('All')
  const [gpa, setGpa] = useState('')
  const [fullTuitionOnly, setFullTuitionOnly] = useState(false)

  const filtered = scholarships.filter(s => {
    if (country !== 'All' && s.country !== country) return false
    if (gpa && parseFloat(gpa) < s.gpaMin) return false
    if (fullTuitionOnly && !s.fullTuition) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Country</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              {allCountries.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">My GPA (out of 10)</label>
            <input
              type="number"
              min="0" max="10" step="0.1"
              placeholder="e.g. 8.2"
              value={gpa}
              onChange={e => setGpa(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={fullTuitionOnly}
                onChange={e => setFullTuitionOnly(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span className="text-sm text-slate-300">Full tuition only</span>
            </label>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        {filtered.length} scholarships match your filters
        {gpa && ` (GPA ≥ ${gpa}/10)`}
      </p>

      {/* Scholarship cards */}
      <div className="space-y-4">
        {filtered.map((s, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                    {s.country}
                  </span>
                  {s.fullTuition && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      Full Tuition
                    </span>
                  )}
                  {s.stipend && (
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
                      + Stipend
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-white">{s.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-400">{s.amount}</p>
              </div>
              <Award className="h-5 w-5 flex-shrink-0 text-amber-400" />
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-400">
              <p><span className="text-slate-500">Eligibility:</span> <span className="text-slate-300">{s.eligibility}</span></p>
              <p><span className="text-slate-500">Deadline:</span> <span className="text-slate-300">{s.deadline}</span></p>
              <p><span className="text-slate-500">Min GPA:</span> <span className="text-slate-300">{s.gpaMin}/10</span></p>
            </div>

            {s.highlight && (
              <p className="mt-2 text-xs text-violet-400">{s.highlight}</p>
            )}

            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300"
            >
              Apply / Learn more <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
            No scholarships match your filters. Try lowering your GPA filter or selecting &quot;All&quot; countries.
          </div>
        )}
      </div>
    </div>
  )
}
