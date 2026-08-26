import ScholarshipFinder from '@/components/ScholarshipFinder'
import { Award } from 'lucide-react'

export const metadata = {
  title: 'Scholarship Finder — GradOS',
  description: '15+ scholarships for Indian students going abroad. Filter by country, GPA, and full tuition options.',
}

export default function ScholarshipsPage() {
  return (
    <main className="flex-1 bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2.5">
            <Award className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Scholarship Finder</h1>
            <p className="text-sm text-slate-400">
              15+ scholarships for Indian students — filter by country and GPA.
            </p>
          </div>
        </div>
        <ScholarshipFinder />
      </div>
    </main>
  )
}
