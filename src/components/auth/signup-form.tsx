// Signup form component - LED Scoreboard style
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Rocket } from 'lucide-react'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthFormWrapper } from './auth-form-wrapper'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }

    setIsLoading(false)
  }

  return (
    <AuthFormWrapper
      title="Join the Team"
      subtitle="Create your account to get started"
      tagline="READY TO PLAY"
      icon={Rocket}
    >
      <form action={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20"
            />
            <p className="text-xs text-zinc-500">Must be at least 6 characters</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/30 space-y-4">
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-sm text-zinc-400 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthFormWrapper>
  )
}
