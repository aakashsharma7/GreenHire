import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { JobLiveEmail } from '@/emails/JobLiveEmail'
import { createElement } from 'react'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  let job;
  try {
    const { databases } = createAdminClient()
    job = await databases.updateDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      params.id,
      {
        status: 'live',
        posted_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      }
    )
    job.id = job.$id // map for email template bounds
  } catch {
    return NextResponse.json({ error: 'Failed to approve job' }, { status: 500 })
  }

  // Send email to employer
  if (job.contact_email) {
    try {
      const jobUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${job.id}`
      await resend.emails.send({
        from: FROM_EMAIL,
        to: job.contact_email,
        subject: 'Your job post is live on GreenHire!',
        react: createElement(JobLiveEmail, {
          jobTitle: job.title,
          companyName: job.company_name,
          jobUrl,
          expiresAt: expiresAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }),
      })
    } catch (emailError) {
      console.error('Failed to send job live email:', emailError)
    }
  }

  return NextResponse.json({ success: true, job })
}
