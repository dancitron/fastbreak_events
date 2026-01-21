// Header component - Pinned top nav
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { NavUser } from './nav-user'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 mr-4 sm:mr-8">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-orange-500 shadow-lg shadow-orange-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg text-white tracking-tight">
            Fastbreak
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/events/new"
            className="text-zinc-400 hover:text-white transition-colors hidden sm:inline"
          >
            Events
          </Link>
          <Link
            href="/venues"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Venues
          </Link>
        </nav>

        {/* User menu - pushed to right */}
        <div className="ml-auto">
          <NavUser />
        </div>
      </div>
    </header>
  )
}
