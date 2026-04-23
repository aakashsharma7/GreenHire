import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID, SUBSCRIBERS_COLLECTION_ID, PAYMENTS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, CreditCard, Users, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export async function AdminStats() {
  const { databases } = createAdminClient()

  const [
    liveJobsResponse,
    pendingJobsResponse,
    subscribersResponse,
    paymentsResponse
  ] = await Promise.all([
    databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [Query.equal('status', 'live'), Query.limit(1)]),
    databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, [Query.equal('status', 'pending'), Query.limit(1)]),
    databases.listDocuments(DATABASE_ID, SUBSCRIBERS_COLLECTION_ID, [Query.limit(1)]),
    databases.listDocuments(DATABASE_ID, PAYMENTS_COLLECTION_ID, [Query.equal('status', 'paid')])
  ]).catch(() => ([{total:0},{total:0},{total:0},{documents:[]}]))

  const liveJobs = liveJobsResponse?.total || 0
  const pendingJobs = pendingJobsResponse?.total || 0
  const subscribers = subscribersResponse?.total || 0
  const payments = paymentsResponse?.documents || []

  const revenue = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{liveJobs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{pendingJobs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{subscribers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(revenue)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
