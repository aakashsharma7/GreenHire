'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Leaf, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      setError('An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center text-white mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5" htmlFor="email">
              Email
            </label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5" htmlFor="password">
              Password
            </label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800" 
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
