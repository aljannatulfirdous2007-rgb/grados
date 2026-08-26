import Link from 'next/link'
import { FileText, MapPin, Plane, Award, ArrowRight, CheckCircle, Star } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'AI SOP Editor',
    description: 'Paste your statement of purpose and get instant scores on structure, clarity, and voice — plus an AI detection flag to make it sound authentically you.',
    href: '/sop',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: MapPin,
    title: 'University Matcher',
    description: 'Enter your GPA, GRE, budget, and field — get 20 best-fit universities ranked by acceptance probability across US, Canada, Europe, and Asia.',
    href: '/matcher',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Plane,
    title: 'Visa Checklist',
    description: 'Step-by-step visa guide for US F-1, Canada Study Permit, UK Student Visa, and Germany — with rejection risk factors and current 2025 approval rates.',
    href: '/visa',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Award,
    title: 'Scholarship Finder',
    description: 'Filter 50+ scholarships by country, budget, and field. Find fully-funded options like DAAD, NUS, Vanier, and Fulbright — ₹0 tuition is possible.',
    href: '/scholarships',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

const testimonials = [
  { name: 'Arun K.', college: 'SRM Chennai', result: 'Admitted to NYU MS CS', quote: 'Rewrote my SOP 3 times using GradOS feedback. Got into NYU in the same cycle.' },
  { name: 'Priya S.', college: 'Vels University', result: 'NTU Singapore — Full Scholarship', quote: 'The scholarship finder showed me NTU options I had no idea existed. Tuition fully covered.' },
  { name: 'Rahul M.', college: 'SAVEETHA Engineering', result: 'TU Munich — DAAD Scholarship', quote: 'The visa checklist for Germany saved me from a rejection. Every document was ready.' },
]

export default function Home() {
  return (
    <main className="flex-1 bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Free to start · No credit card needed
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Your AI grad school{' '}
            <span className="text-emerald-400">operating system</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
            SOP editing, university matching, visa checklists, and scholarship finding — all in one place.
            97% cheaper than a consultant.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sop"
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
            >
              Analyze my SOP free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/matcher"
              className="flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              Find my universities
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {['No signup required', '₹500 vs ₹15,000 consultant', 'US · Canada · UK · Europe · Asia'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Everything you need to get admitted
          </h2>
          <p className="mt-3 text-center text-slate-400">
            Built for Indian students applying abroad. No consultants. No confusion.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, href, color, bg, border }) => (
              <Link
                key={href}
                href={href}
                className={`group rounded-2xl border ${border} ${bg} p-6 transition-all hover:border-opacity-60 hover:scale-[1.02]`}
              >
                <div className={`mb-4 inline-flex rounded-xl p-2.5 ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${color}`}>
                  Try it free <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-slate-800 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-white">
            Chennai students who got admitted
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {testimonials.map(({ name, college, result, quote }) => (
              <div
                key={name}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-slate-500">{college}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">{result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-slate-800 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Simple pricing</h2>
          <p className="mt-3 text-slate-400">Consultants charge ₹15,000–30,000. We charge ₹500.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Free', price: '₹0', features: ['1 SOP analysis/month', 'Basic visa checklist', 'University search'], cta: 'Get started', highlight: false },
              { name: 'Pro', price: '₹500', features: ['Unlimited SOP analyses', 'AI detection & rewrite', 'Scholarship finder', 'University matcher', 'Full visa guides'], cta: 'Start Pro', highlight: true },
              { name: 'Premium', price: '₹1,000', features: ['Everything in Pro', '1-on-1 review call', 'Priority support', 'Essay strategy session'], cta: 'Go Premium', highlight: false },
            ].map(({ name, price, features, cta, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl p-6 ${
                  highlight
                    ? 'border border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'border border-slate-800 bg-slate-900'
                }`}
              >
                {highlight && (
                  <span className="mb-3 inline-block rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-semibold text-white">{name}</h3>
                <p className="mt-1 text-3xl font-bold text-white">
                  {price}
                  {price !== '₹0' && <span className="text-base font-normal text-slate-400">/month</span>}
                </p>
                <ul className="mt-4 space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sop"
                  className={`mt-6 block rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors ${
                    highlight
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                      : 'border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Your admission season starts now
          </h2>
          <p className="mt-4 text-slate-400">
            Applications open October. Build your shortlist, perfect your SOP, and get your visa docs ready — before everyone else.
          </p>
          <Link
            href="/sop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            Analyze my SOP — it&apos;s free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-4 py-8 text-center text-sm text-slate-600">
        <p>Built in Chennai for Indian grad school applicants. GradOS © 2025</p>
      </footer>
    </main>
  )
}
