'use client'

import { useState } from 'react'
import { CheckCircle, Circle, AlertTriangle, Clock, ExternalLink } from 'lucide-react'

const visaData = {
  USA: {
    visaType: 'F-1 Student Visa',
    postStudyWork: 'OPT: 12 months (STEM: 36 months)',
    approvalRate: '68%',
    processingTime: '3–8 weeks',
    cost: '$350 (SEVIS) + $185 (visa fee)',
    steps: [
      { id: 'i20', label: 'Receive I-20 from your university', critical: true, doc: 'I-20 form from ISSS office' },
      { id: 'sevis', label: 'Pay SEVIS fee ($350) at FMJfee.com', critical: true, doc: 'SEVIS I-901 payment receipt' },
      { id: 'ds160', label: 'Fill DS-160 online application', critical: true, doc: 'DS-160 confirmation barcode' },
      { id: 'appointment', label: 'Book visa interview at US Consulate Chennai', critical: true, doc: 'Appointment confirmation' },
      { id: 'financials', label: 'Gather financial documents (1 year tuition + living)', critical: true, doc: 'Bank statements showing $40,000+' },
      { id: 'ties', label: 'Prepare "ties to India" evidence', critical: true, doc: 'Property papers / family letters / job offer after graduation' },
      { id: 'photos', label: 'Get US visa photos (51mm × 51mm, white background)', critical: false, doc: '2 photos' },
      { id: 'interview', label: 'Attend visa interview — be confident, speak clearly', critical: true, doc: 'All documents in one folder' },
    ],
    rejectionReasons: [
      'Could not prove strong ties to India (most common reason)',
      'Insufficient financial documentation',
      'Vague answers about career plans post-graduation',
      'Applied too late (less than 3 months before program start)',
    ],
    tips: 'Consulate Chennai rejection rate is ~30%. Prepare a 30-second answer to "Why this university?" and "What will you do after graduation?" with specific details.',
  },
  Canada: {
    visaType: 'Study Permit',
    postStudyWork: 'PGWP: up to 3 years (pathway to PR)',
    approvalRate: '62%',
    processingTime: '4–12 weeks',
    cost: 'CAD $150 + CAD $85 biometrics',
    steps: [
      { id: 'loa', label: 'Receive Letter of Acceptance from DLI university', critical: true, doc: 'LOA with program details' },
      { id: 'ircc', label: 'Create IRCC account at ircc.canada.ca', critical: true, doc: 'Account login credentials' },
      { id: 'biometrics', label: 'Pay biometrics fee (CAD $85) and enroll at VFS', critical: true, doc: 'Biometrics instruction letter' },
      { id: 'financials', label: 'Show CAD $10,000+ in bank (first year living)', critical: true, doc: 'Bank statements, last 6 months' },
      { id: 'gic', label: 'Open a GIC (Guaranteed Investment Certificate) at approved bank', critical: true, doc: 'GIC receipt — CAD $10,000+' },
      { id: 'medicals', label: 'Complete medical exam with IRCC-approved doctor', critical: false, doc: 'Medical exam results' },
      { id: 'sop_ca', label: 'Write Study Plan explaining why Canada + this program', critical: true, doc: 'Study plan letter (1 page)' },
      { id: 'submit', label: 'Submit online application and wait for processing', critical: true, doc: 'Tracking number confirmation' },
    ],
    rejectionReasons: [
      'Insufficient funds (under CAD $20,000 recommended)',
      'Weak study plan — no clear reason for choosing Canada',
      'No evidence of ties to India / intent to return',
      'Missing GIC (required since 2024)',
    ],
    tips: 'Canada rejections hit 31% in Q1 2025 due to new caps. Apply early (6+ months before start) and be very specific in your study plan about why this exact program at this exact university.',
  },
  UK: {
    visaType: 'Student Visa (Tier 4)',
    postStudyWork: 'Graduate Route: 2 years (PhD: 3 years)',
    approvalRate: '74%',
    processingTime: '3 weeks (standard) / 5 days (priority)',
    cost: '£363 + £776/year Immigration Health Surcharge',
    steps: [
      { id: 'cas', label: 'Receive CAS (Confirmation of Acceptance for Studies) from university', critical: true, doc: 'CAS reference number' },
      { id: 'finances_uk', label: 'Prove £1,334/month for 9 months in bank for 28 days', critical: true, doc: 'Bank statement held for 28+ days' },
      { id: 'ukvi', label: 'Apply online at UKVI (UK Visa and Immigration)', critical: true, doc: 'Application confirmation' },
      { id: 'ihs', label: 'Pay Immigration Health Surcharge (£776/year)', critical: true, doc: 'IHS payment receipt' },
      { id: 'biometrics_uk', label: 'Attend biometrics appointment at VFS Global', critical: true, doc: 'Appointment letter + passport' },
      { id: 'english', label: 'Show English language proof (IELTS 6.0+ / TOEFL 80+)', critical: true, doc: 'IELTS/TOEFL score report' },
      { id: 'tb', label: 'Complete TB test (mandatory for India)', critical: true, doc: 'TB test certificate from approved clinic' },
    ],
    rejectionReasons: [
      'Bank statement not held for 28+ consecutive days',
      'Funds in multiple accounts — show primary account only',
      'TB test from non-approved clinic',
      'CAS expired before applying',
    ],
    tips: 'UK Graduate Route gives 2 years to work after graduation — this is a major advantage. The visa approval rate from India is relatively high (~74%) but financial documentation must be perfect.',
  },
  Germany: {
    visaType: 'National Visa (Student)',
    postStudyWork: '18 months job-seeking visa → EU Blue Card (permanent)',
    approvalRate: '81%',
    processingTime: '6–12 weeks',
    cost: '€75 visa fee',
    steps: [
      { id: 'admission', label: 'Get university admission letter (or Studienkolleg acceptance)', critical: true, doc: 'Official admission letter' },
      { id: 'german_bank', label: 'Open blocked account (Sperrkonto) with €11,208', critical: true, doc: 'Sperrkonto confirmation from Fintiba / Deutsche Bank' },
      { id: 'insurance', label: 'Get travel health insurance for visa application', critical: true, doc: 'Insurance certificate (€30,000 coverage)' },
      { id: 'motivation', label: 'Write Motivationsschreiben (motivation letter) in English/German', critical: false, doc: 'Typed, signed letter' },
      { id: 'academic', label: 'Get transcripts attested / apostilled', critical: true, doc: 'Notarized transcripts + degree certificate' },
      { id: 'appointment_de', label: 'Book appointment at German Consulate Chennai / Mumbai', critical: true, doc: 'Appointment confirmation' },
      { id: 'attend_de', label: 'Attend visa appointment with complete file', critical: true, doc: 'All documents in neat folder' },
    ],
    rejectionReasons: [
      'Blocked account opened too late (open 3+ months early)',
      'Missing apostille on transcripts',
      'University admission letter is conditional',
      'No German language proof (required for German-taught programs)',
    ],
    tips: 'Germany has the highest visa approval rate (~81%) from India. Most public universities are tuition-free. The blocked account (€11,208) is mandatory — open it with Fintiba or Deutsche Bank India.',
  },
  Singapore: {
    visaType: 'Student Pass',
    postStudyWork: 'Long-term visit pass + job search (up to 1 year)',
    approvalRate: '85%',
    processingTime: '2–4 weeks',
    cost: 'SGD $30 issuance fee',
    steps: [
      { id: 'icas', label: 'Register on SOLAR+ (Student\'s Pass On-Line Application) after university acceptance', critical: true, doc: 'SOLAR+ application form' },
      { id: 'health_sg', label: 'Complete medical examination at approved clinic', critical: true, doc: 'Medical exam certificate' },
      { id: 'insurance_sg', label: 'Purchase medical insurance (MediShield Life)', critical: true, doc: 'Insurance policy document' },
      { id: 'ipa', label: 'Receive In-Principle Approval (IPA) letter', critical: true, doc: 'IPA letter from ICA' },
      { id: 'arrive', label: 'Arrive in Singapore with IPA letter', critical: true, doc: 'IPA letter + passport + acceptance letter' },
      { id: 'collect', label: 'Collect Student Pass at ICA within 1 week of arrival', critical: true, doc: 'IPA letter + passport photos' },
    ],
    rejectionReasons: [
      'Missing medical exam from approved clinic',
      'Inconsistent information between application and passport',
    ],
    tips: 'Singapore has the highest approval rate (~85%). NUS and NTU both have generous scholarships for Indian students. The Student Pass process is straightforward — follow the SOLAR+ steps exactly.',
  },
}

type Country = keyof typeof visaData

export default function VisaChecklist() {
  const [country, setCountry] = useState<Country>('USA')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const data = visaData[country]
  const completedCount = data.steps.filter(s => checked[s.id]).length

  function toggle(id: string) {
    setChecked(c => ({ ...c, [id]: !c[id] }))
  }

  return (
    <div className="space-y-6">
      {/* Country selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(visaData) as Country[]).map(c => (
          <button
            key={c}
            onClick={() => { setCountry(c); setChecked({}) }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              country === c
                ? 'border-sky-500 bg-sky-500/20 text-sky-300'
                : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Visa summary */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-slate-500">Visa type</span>
            <p className="font-medium text-white">{data.visaType}</p>
          </div>
          <div>
            <span className="text-slate-500">Approval rate (India)</span>
            <p className="font-medium text-emerald-400">{data.approvalRate}</p>
          </div>
          <div>
            <span className="text-slate-500">Processing</span>
            <p className="font-medium text-white">{data.processingTime}</p>
          </div>
          <div>
            <span className="text-slate-500">Cost</span>
            <p className="font-medium text-white">{data.cost}</p>
          </div>
          <div>
            <span className="text-slate-500">Post-study work</span>
            <p className="font-medium text-sky-400">{data.postStudyWork}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Checklist progress</span>
          <span className="font-medium text-white">{completedCount} / {data.steps.length}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(completedCount / data.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {data.steps.map(step => (
          <button
            key={step.id}
            onClick={() => toggle(step.id)}
            className={`w-full rounded-xl border p-4 text-left transition-all ${
              checked[step.id]
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-slate-800 bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {checked[step.id]
                ? <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                : <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${checked[step.id] ? 'line-through text-slate-500' : 'text-white'}`}>
                    {step.label}
                  </span>
                  {step.critical && !checked[step.id] && (
                    <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-xs text-red-400">Required</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{step.doc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Rejection reasons */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
          <AlertTriangle className="h-4 w-4" /> Top rejection reasons from India
        </h3>
        <ul className="space-y-1.5">
          {data.rejectionReasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Pro tip */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
          <Clock className="h-4 w-4" /> Pro tip
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{data.tips}</p>
      </div>

      <a
        href={`https://www.google.com/search?q=${country}+student+visa+requirements+for+Indian+students+2025`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300"
      >
        Check latest {country} visa requirements <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
