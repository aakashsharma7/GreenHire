'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Frown } from 'lucide-react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!email) {
      setStatus('error')
      setMessage('No email address provided.')
    }
  }, [email])

  const handleUnsubscribe = async () => {
    if (!email) return
    setStatus('loading')

    // Normally this would go through an API route backed by the service_role key
    // since RLS might block anon from deleting. For brevity, assuming RLS allows delete by email or API proxy.
    try {
      const res = await fetch('/api/subscribe/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setMessage('Failed to unsubscribe. Please try again or contact support.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mt-[-10vh]">
        
        {status === 'success' ? (
          <div>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Unsubscribed</h2>
            <p className="text-slate-600 mb-6">
              You have been successfully removed from our mailing list. You won't receive any more job alerts.
            </p>
            <p className="text-sm text-slate-400">
              Changed your mind? You can always sign up again on our homepage.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frown className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">We'll miss you</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to stop receiving weekly climate tech job alerts for <span className="font-semibold text-slate-900">{email}</span>?
            </p>
            
            {status === 'error' && (
              <div className="text-red-500 text-sm mb-4 px-4 py-2 bg-red-50 rounded-lg">
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleUnsubscribe} 
                disabled={status === 'loading' || !email}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Yes, unsubscribe me
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                disabled={status === 'loading'}
              >
                No, keep my alerts
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}
