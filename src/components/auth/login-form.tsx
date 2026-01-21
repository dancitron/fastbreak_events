// Login form component - LED Scoreboard style
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Trophy } from 'lucide-react'
import { signIn } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthFormWrapper } from './auth-form-wrapper'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // If successful, signIn will redirect to /dashboard
  }

  return (
    <AuthFormWrapper
      title="Welcome Back"
      subtitle="Sign in to manage your events"
      tagline="GET IN THE GAME"
      icon={Trophy}
    >
      <form action={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
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
              required
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-orange-500/20"
            />
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-sm text-zinc-400 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthFormWrapper>
  )
}
