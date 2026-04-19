'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Leaf, CheckCircle, Loader2 } from 'lucide-react'

export function SubscribeForm({ variant = 'hero' }: { variant?: 'hero' | 'inline' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('Check your inbox to confirm your subscription!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-white border-white/30 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 h-11"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-primary-700 hover:bg-slate-100 font-semibold h-11 px-6 w-full sm:w-auto transition-colors duration-150"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Leaf className="w-4 h-4 mr-2" />
              Get Job Alerts
            </>
          )}
        </Button>
        {status === 'error' && (
          <p className="text-red-300 text-xs mt-1 sm:col-span-2">{message}</p>
        )}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 text-sm"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          size="sm"
          className="bg-primary-700 hover:bg-primary-800 text-white transition-colors duration-150"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
        </Button>
      </div>
      {status === 'error' && <p className="text-red-500 text-xs">{message}</p>}
    </form>
  )
}
