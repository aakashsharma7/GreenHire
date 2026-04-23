'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Loader2 } from 'lucide-react'

// This page handles the visual redirect after OAuth succeeds
// The actual session cookie is set by /api/auth/callback
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Short delay then redirect home — middleware will check the cookie
    const timer = setTimeout(() => router.replace('/'), 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center shadow-xl shadow-[var(--accent-primary)]/30 animate-pulse">
        <Leaf className="w-6 h-6 text-black" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-primary)]" />
        <p className="text-sm text-[var(--text-secondary)]">Signing you in…</p>
      </div>
    </div>
  )
}
