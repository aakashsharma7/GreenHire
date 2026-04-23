'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

const requirements = [
  { test: (p: string) => p.length >= 8, label: '8+ characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account.')
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent-secondary)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/30 group-hover:shadow-[var(--accent-primary)]/50 transition-shadow">
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              GreenHire
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] text-center">
            Create your account
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 text-center">
            Join thousands of climate tech professionals
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[var(--bg-surface)] backdrop-blur-md p-6 shadow-2xl shadow-black/50">
          {/* Social buttons */}
          <SocialAuthButtons mode="signup" />

          {/* Divider */}
          <div className="relative my-5 flex items-center">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="px-3 text-xs text-[var(--text-muted)] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength checklist */}
              {(passwordFocused || password.length > 0) && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {requirements.map((req) => {
                    const met = req.test(password)
                    return (
                      <div key={req.label} className={`flex items-center gap-1 text-xs transition-colors ${met ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                        <CheckCircle2 className={`w-3 h-3 ${met ? 'opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-black font-semibold text-sm transition-all shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-[var(--text-secondary)] mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
