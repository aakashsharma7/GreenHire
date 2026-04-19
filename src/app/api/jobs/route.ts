import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { ID, Query } from 'node-appwrite'
import { z } from 'zod'

const jobSchema = z.object({
  title: z.string().min(3).max(100),
  company_name: z.string().min(2).max(100),
  company_logo_url: z.string().url().optional().nullable(),
  description: z.string().min(100),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  location: z.string().min(2).max(100),
  is_remote: z.boolean().default(false),
  salary_min: z.number().int().positive().optional().nullable(),
  salary_max: z.number().int().positive().optional().nullable(),
  apply_url: z.string().url(),
  contact_email: z.string().email(),
})

// Rate limiting via in-memory store (simple, per instance)
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const record = rateLimits.get(ip)

  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= limit) return false
  record.count++
  return true
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const jobType = searchParams.get('job_type')
  const isRemote = searchParams.get('is_remote')
  const sort = searchParams.get('sort')

  const queries = [
    Query.equal('status', 'live'),
    Query.greaterThan('expires_at', new Date().toISOString())
  ]

  if (search) {
    queries.push(
      Query.or([
        Query.search('title', search),
        Query.search('company_name', search),
        Query.search('description', search)
      ])
    )
  }

  if (jobType) {
    queries.push(Query.equal('job_type', jobType))
  }

  if (isRemote === 'true') {
    queries.push(Query.equal('is_remote', true))
  }

  if (sort === 'latest') {
    queries.push(Query.orderDesc('created_at'))
  } else {
    queries.push(Query.orderDesc('is_featured'))
    queries.push(Query.orderDesc('created_at'))
  }

  try {
    const { databases } = createAdminClient()
    const res = await databases.listDocuments(DATABASE_ID, JOBS_COLLECTION_ID, queries)
    
    return NextResponse.json({ jobs: res.documents.map(d => ({ ...d, id: d.$id })), count: res.total })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = jobSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 422 })
  }

  try {
    const { databases } = createAdminClient()
    const doc = await databases.createDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      ID.unique(),
      { ...parsed.data, status: 'pending' }
    )

    return NextResponse.json({ jobId: doc.$id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
