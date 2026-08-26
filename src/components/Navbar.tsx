'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'

const links = [
  { href: '/sop', label: 'SOP Editor' },
  { href: '/matcher', label: 'University Matcher' },
  { href: '/visa', label: 'Visa Guide' },
  { href: '/scholarships', label: 'Scholarships' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <span className="text-lg">GradOS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                pathname === href
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sop"
            className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm ${
                pathname === href ? 'text-emerald-400 font-medium' : 'text-slate-300'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/sop"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Start Free
          </Link>
        </div>
      )}
    </nav>
  )
}
