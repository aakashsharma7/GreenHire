import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Briefcase, Star, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatSalary, formatTimeAgo, getInitials } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact'
}

const JOB_TYPE_COLORS: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-800 border-green-200',
  'part-time': 'bg-blue-100 text-blue-800 border-blue-200',
  'contract': 'bg-purple-100 text-purple-800 border-purple-200',
  'internship': 'bg-orange-100 text-orange-800 border-orange-200',
}

export function JobCard({ job, variant = 'default' }: JobCardProps) {
  const isCompact = variant === 'compact'

  return (
    <article
      className={cn(
        'group relative bg-white rounded-xl border transition-all duration-150 hover:shadow-md',
        job.is_featured
          ? 'border-l-4 border-l-amber-400 border-amber-200 bg-amber-50/20 hover:border-amber-300'
          : 'border-slate-200 hover:border-slate-300',
        isCompact ? 'p-4' : 'p-5'
      )}
    >
      {/* Featured badge */}
      {job.is_featured && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            Featured
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.company_logo_url ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src={job.company_logo_url}
                alt={`${job.company_name} logo`}
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-700">
                {getInitials(job.company_name)}
              </span>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/jobs/${job.id}`}
                className="text-base font-semibold text-slate-900 hover:text-primary-700 transition-colors duration-150 line-clamp-1 pr-16"
              >
                {job.title}
              </Link>
              <p className="text-sm text-slate-600 mt-0.5 font-medium">{job.company_name}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            {job.is_remote && (
              <Badge variant="outline" className="text-xs px-2 py-0 border-emerald-300 text-emerald-700 bg-emerald-50">
                Remote
              </Badge>
            )}
            <Badge
              variant="outline"
              className={cn('text-xs px-2 py-0 border capitalize', JOB_TYPE_COLORS[job.job_type] || '')}
            >
              {job.job_type}
            </Badge>
          </div>

          {/* Salary + Date */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(job.posted_at || job.created_at)}
              </span>
              {!isCompact && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    className="bg-primary-700 hover:bg-primary-800 text-white text-xs h-8 transition-colors duration-150 flex items-center gap-1"
                  >
                    Apply now
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
