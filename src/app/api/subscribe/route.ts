import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, SUBSCRIBERS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { z } from 'zod'
import { createElement } from 'react'

const subscribeSchema = z.object({
  email: z.string().email(),
})

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimits.get(ip)
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (record.count >= 5) return false
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = subscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 })
  }

  const { email } = parsed.data
  const token = crypto.randomUUID()

  // Upsert subscriber
  // Check if subscriber exists
  let existingSubscriber = null
  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      SUBSCRIBERS_COLLECTION_ID,
      [Query.equal('email', email), Query.limit(1)]
    )
    if (documents.length > 0) {
      existingSubscriber = documents[0]
    }
  } catch (err) {
    console.error('Error fetching subscriber:', err)
  }

  try {
    const { databases } = createAdminClient()
    if (existingSubscriber) {
      await databases.updateDocument(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION_ID,
        existingSubscriber.$id,
        { confirmation_token: token, confirmed: false }
      )
    } else {
      await databases.createDocument(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION_ID,
        'unique()',
        { email, confirmation_token: token, confirmed: false }
      )
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/subscribe/confirm?token=${token}`

  // Send confirmation email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Confirm your GreenHire job alerts',
      react: createElement(WelcomeEmail, { confirmUrl }),
    })
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError)
  }

  return NextResponse.json({ success: true })
}
