'use client'

import { useState } from 'react'
import { Job } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatTimeAgo } from '@/lib/utils'
import { Check, X, ExternalLink, Loader2 } from 'lucide-react'

export function AdminJobTable({ initialJobs, type }: { initialJobs: Job[], type: 'pending' | 'live' }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/jobs/${id}/approve`, { method: 'POST' })
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id))
      }
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this job?')) return
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/jobs/${id}/reject`, { method: 'POST' })
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id))
      }
    } finally {
      setLoading(null)
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-lg">
        No {type} jobs found.
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            {type === 'pending' ? <TableHead>Posted</TableHead> : <TableHead>Expires</TableHead>}
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.company_name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {job.title}
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary-600">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-xs text-slate-500 mt-1 capitalize">{job.job_type}</div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">{job.location}</span>
                {job.is_remote && <Badge variant="outline" className="ml-2 text-[10px]">Remote</Badge>}
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {type === 'pending' ? formatTimeAgo(job.created_at) : formatTimeAgo(job.expires_at)}
              </TableCell>
              <TableCell>
                {job.is_featured ? (
                  <Badge className="bg-amber-100 text-amber-700 border border-amber-300">Yes</Badge>
                ) : (
                  <span className="text-slate-400 text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {type === 'pending' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(job.id)}
                      disabled={loading === job.id}
                    >
                      {loading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(job.id)}
                      disabled={loading === job.id}
                    >
                      {loading === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
