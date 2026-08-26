import VisaChecklist from '@/components/VisaChecklist'
import { Plane } from 'lucide-react'

export const metadata = {
  title: 'Visa Checklist — GradOS',
  description: 'Step-by-step visa guide for US, Canada, UK, Germany, and Singapore student visas for Indian applicants.',
}

export default function VisaPage() {
  return (
    <main className="flex-1 bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-sky-500/10 p-2.5">
            <Plane className="h-6 w-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Visa Checklist</h1>
            <p className="text-sm text-slate-400">
              Country-specific step-by-step visa guide with rejection risk factors.
            </p>
          </div>
        </div>
        <VisaChecklist />
      </div>
    </main>
  )
}
