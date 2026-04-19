import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Leaf } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful | GreenHire',
  robots: { index: false },
}

export default function PostJobSuccessPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Payment Received!</h2>
          <p className="mt-3 text-slate-500">
            Thank you for posting on GreenHire. Your job is currently under review by our team and will go live within 24 hours.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Leaf className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-slate-900">What happens next?</span>
          </div>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>We review the post to ensure quality.</li>
            <li>Once approved, you'll receive an email notification.</li>
            <li>The job will be shared in our next weekly newsletter.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link href="/post-a-job">
            <Button className="w-full bg-primary-700 hover:bg-primary-800">
              Post another job
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full text-slate-600">
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
