'use client'

import { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface AuthFormWrapperProps {
  title: string
  subtitle: string
  tagline: string
  icon: LucideIcon
  children: ReactNode
}

export function AuthFormWrapper({
  title,
  subtitle,
  tagline,
  icon: Icon,
  children,
}: AuthFormWrapperProps) {
  return (
    <div className="w-full max-w-md">
      {/* Scoreboard-style card */}
      <div className="relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg shadow-orange-500/10">
        {/* LED accent bar at top */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-950/50 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-3">
            <Icon className="w-6 h-6 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Fun tagline */}
      <p className="text-center text-zinc-600 text-xs mt-4 font-mono">
        {tagline}
      </p>
    </div>
  )
}
