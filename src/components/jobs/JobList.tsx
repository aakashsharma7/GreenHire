import { JobCard } from './JobCard'
import { Briefcase } from 'lucide-react'
import type { Job } from '@/types'

interface JobListProps {
  jobs: Job[]
  count: number
}

export function JobList({ jobs, count }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-slate-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Try adjusting your filters or search query. New climate tech jobs are added daily.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4 font-medium">
        Showing <span className="text-slate-900 font-semibold">{count}</span>{' '}
        {count === 1 ? 'job' : 'jobs'}
      </p>
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
