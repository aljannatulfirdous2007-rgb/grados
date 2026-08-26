import SOPEditor from '@/components/SOPEditor'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'AI SOP Editor — GradOS',
  description: 'Get instant AI feedback on your Statement of Purpose. Structure, clarity, voice scores + AI detection.',
}

export default function SOPPage() {
  return (
    <main className="flex-1 bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-2.5">
            <FileText className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI SOP Editor</h1>
            <p className="text-sm text-slate-400">
              Get your SOP scored on structure, clarity, and voice — plus an AI detection check.
            </p>
          </div>
        </div>
        <SOPEditor />
      </div>
    </main>
  )
}
