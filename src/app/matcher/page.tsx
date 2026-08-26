import UniversityMatcher from '@/components/UniversityMatcher'
import { MapPin } from 'lucide-react'

export const metadata = {
  title: 'University Matcher — GradOS',
  description: 'Find the 20 best universities for your GPA, GRE, and budget. US, Canada, UK, Europe, Asia.',
}

export default function MatcherPage() {
  return (
    <main className="flex-1 bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5">
            <MapPin className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">University Matcher</h1>
            <p className="text-sm text-slate-400">
              Enter your profile and get 12 universities ranked by acceptance probability.
            </p>
          </div>
        </div>
        <UniversityMatcher />
      </div>
    </main>
  )
}
