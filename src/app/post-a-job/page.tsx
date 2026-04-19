import { PostJobForm } from '@/components/forms/PostJobForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post a Job | GreenHire',
  description: 'Hire the best climate tech professionals. Post your open roles on GreenHire.',
}

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 border-t border-slate-200 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Find your next climate champion
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Reach a community of over 18,000 professionals passionate about clean energy, sustainability, and combating climate change.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8">
        <PostJobForm />
      </div>
    </div>
  )
}
