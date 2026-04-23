import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminStats } from '@/components/admin/AdminStats'
import { AdminJobTable } from '@/components/admin/AdminJobTable'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { LogOut } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | GreenHire',
  robots: { index: false }
}

export default async function AdminDashboard() {
  const { databases } = createAdminClient()

  // Fetch jobs
  const [pendingJobsResponse, liveJobsResponse] = await Promise.all([
    databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [Query.equal('status', 'pending'), Query.orderDesc('created_at')]),
    databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [Query.equal('status', 'live'), Query.orderDesc('created_at'), Query.limit(50)])
  ]).catch(() => ([{documents:[]}, {documents:[]}]))

  const pendingJobs = (pendingJobsResponse?.documents?.map(d => ({...d, id: d.$id})) || []) as any[]
  const liveJobs = (liveJobsResponse?.documents?.map(d => ({...d, id: d.$id})) || []) as any[]

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage jobs, payments, and subscribers.</p>
          </div>
          <form action="/admin/login" method="GET">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>

        <AdminStats />

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Pending Review</h2>
          <AdminJobTable initialJobs={pendingJobs || []} type="pending" />
        </div>

        <div className="space-y-4 pt-8">
          <h2 className="text-xl font-bold text-slate-900">Live Jobs (Recent 50)</h2>
          <AdminJobTable initialJobs={liveJobs || []} type="live" />
        </div>
        
      </div>
    </div>
  )
}
