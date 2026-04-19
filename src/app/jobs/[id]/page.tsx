import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Query } from 'node-appwrite'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { formatSalary, formatTimeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SubscribeForm } from '@/components/forms/SubscribeForm'
import { MapPin, Calendar, Briefcase, DollarSign, ExternalLink, ArrowLeft, Heart, Share2, Building2, ArrowUpRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Job } from '@/types'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

async function getJob(id: string): Promise<Job | null> {
  try {
    const { databases } = createAdminClient()
    const doc = await databases.getDocument(DATABASE_ID, JOBS_COLLECTION_ID, id)
    
    if (doc.status !== 'live') return null
    return { ...doc, id: doc.$id } as unknown as Job
  } catch {
    return null
  }
}

async function getRelatedJobs(companyName: string, excludeId: string): Promise<Job[]> {
  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [
        Query.equal('company_name', companyName),
        Query.equal('status', 'live'),
        Query.notEqual('$id', excludeId),
        Query.limit(3)
      ]
    )
    return documents.map(d => ({ ...d, id: d.$id })) as unknown as Job[]
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const job = await getJob(params.id)
  if (!job) return { title: 'Job Not Found | GreenHire' }

  return {
    title: `${job.title} at ${job.company_name}`,
    description: job.description.slice(0, 155),
    openGraph: {
      title: `${job.title} at ${job.company_name} | GreenHire`,
      description: job.description.slice(0, 155),
    },
  }
}

export async function generateStaticParams() {
  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [
        Query.equal('status', 'live'),
        Query.limit(10),
        Query.select(['$id'])
      ]
    )
    return documents.map(({ $id }) => ({ id: $id }))
  } catch {
    return []
  }
}

export const revalidate = 3600

export default async function JobDetailPage({ params }: PageProps) {
  const [job, relatedJobs] = await Promise.all([
    getJob(params.id),
    getJob(params.id).then((j) =>
      j ? getRelatedJobs(j.company_name, params.id) : []
    ),
  ])

  if (!job) notFound()

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo_url && { logo: job.company_logo_url }),
    },
    jobLocation: {
      '@type': 'Place',
      address: job.location,
    },
    employmentType: job.job_type?.toUpperCase(),
    datePosted: job.posted_at,
    validThrough: job.expires_at,
    ...(job.is_remote && { jobLocationType: 'TELECOMMUTE' }),
    ...(job.salary_min && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min,
          maxValue: job.salary_max,
          unitText: 'YEAR',
        },
      },
    }),
  }

  return (
    <div className="pt-32 pb-20 max-w-[1200px] mx-auto px-6 selection:bg-accent-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1 space-y-6 overflow-hidden">
          
          {/* Header Card */}
          <div className="bg-bg-surface/30 backdrop-blur-md rounded-xl border border-border-subtle p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {job.company_logo_url ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border-subtle bg-white flex-shrink-0 shadow-lg">
                    <Image
                      src={job.company_logo_url}
                      alt={`${job.company_name} logo`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent-primary/20">
                    <span className="text-2xl font-display font-bold text-white">
                      {job.company_name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2 tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                    <span className="font-semibold text-white">{job.company_name}</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted" />
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button className="p-3 rounded-lg border border-border-subtle hover:bg-bg-elevated transition-colors text-text-secondary hover:text-white shrink-0">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-lg border border-border-subtle hover:bg-bg-elevated transition-colors text-text-secondary hover:text-white shrink-0">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-border-subtle/50">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-bg-elevated border border-border-subtle text-text-primary capitalize">
                {job.job_type || 'Full-time'}
              </span>
              {job.is_remote && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/30 text-green-400">
                  Remote OK
                </span>
              )}
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-white">
                  <DollarSign className="w-4 h-4 text-text-muted" />
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1 text-sm text-text-muted ml-auto">
                <Calendar className="w-4 h-4" />
                Posted {formatTimeAgo(job.posted_at || job.created_at)}
              </span>
            </div>
          </div>

          {/* Job Description (Prose) */}
          <div className="bg-bg-surface/30 backdrop-blur-md rounded-xl border border-border-subtle p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-white mb-6">About the Role</h2>
            <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline prose-p:text-text-secondary prose-li:text-text-secondary">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </article>
          </div>
          
          {/* About Company Mock Section */}
          <div className="bg-bg-surface/30 backdrop-blur-md rounded-xl border border-border-subtle p-6 lg:p-8">
            <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent-primary" /> About {job.company_name}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              {job.company_name} is fundamentally redefining sustainability and clean architecture. Our mission is to engineer solutions that radically drop emissions without sacrificing performance. We believe the future belongs to those who act urgently, build exceptionally, and treat the climate crisis as the most thrilling engineering challenge of our generation.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-accent-primary font-medium text-sm hover:underline">
              View full company profile <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Sticky Sidebar Right Column */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* CTA Box */}
            <div className="bg-bg-surface/30 backdrop-blur-md border border-border-subtle rounded-xl p-6">
              <h3 className="font-display font-bold text-lg text-white mb-4">Ready to build the future?</h3>
              <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-gradient-to-br from-accent-primary to-emerald-600 hover:from-accent-primary/90 hover:to-emerald-600/90 text-white font-bold h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all rounded-lg text-base border-0">
                  Apply Now
                </Button>
              </a>
              <p className="text-xs text-text-muted mt-4 text-center">
                You will be redirected to the company tracking portal.
              </p>
              
              <div className="w-full h-px bg-border-subtle my-6" />
              
              {/* Meta Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Job Type</span>
                  <span className="font-medium text-white capitalize">{job.job_type || 'Full-time'}</span>
                </div>
                {job.is_remote && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Work Style</span>
                    <span className="font-medium text-white">Remote OK</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Location</span>
                  <span className="font-medium text-white text-right max-w-[150px] truncate" title={job.location}>{job.location}</span>
                </div>
                {job.salary_min && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Salary Range</span>
                    <span className="font-medium text-white">{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subscribe Box */}
            <div className="bg-bg-surface/30 backdrop-blur-md border border-border-subtle rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 bg-gradient-to-bl from-accent-primary/40 to-transparent blur-3xl w-full h-full rounded-full pointer-events-none" />
              <h3 className="font-display font-bold text-white mb-2 relative z-10">Get alerts for jobs like this</h3>
              <p className="text-sm text-text-secondary mb-5 relative z-10">
                Weekly digest of the most critical climate tech opportunities.
              </p>
              <div className="relative z-10">
                 <SubscribeForm />
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* Similar Jobs Row */}
      {relatedJobs.length > 0 && (
        <div className="mt-16 pt-16 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">
              More opportunities at {job.company_name}
            </h2>
            <Link href="/jobs" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
              View all roles
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedJobs.map((relJob) => (
              <Link
                key={relJob.id}
                href={`/jobs/${relJob.id}`}
                className="group block p-6 rounded-xl border border-border-subtle bg-bg-surface/30 hover:bg-bg-surface/60 hover:border-text-muted transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-accent-secondary transition-colors line-clamp-1">
                    {relJob.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-text-muted group-hover:text-white transition-colors shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
                
                <div className="flex items-center gap-3 text-sm text-text-secondary mb-6">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {relJob.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-bg-elevated border border-border-subtle text-xs font-medium text-text-primary capitalize">
                    {relJob.job_type || 'Full-time'}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatTimeAgo(relJob.posted_at || relJob.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
