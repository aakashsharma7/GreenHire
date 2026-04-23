import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, PAYMENTS_COLLECTION_ID } from '@/lib/appwrite'
import { ID } from 'node-appwrite'
import { stripe, PRICING } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  jobId: z.string().min(1),
  plan: z.enum(['single', 'bundle', 'featured']),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 422 })
  }

  const { jobId, plan } = parsed.data
  const pricing = PRICING[plan]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pricing.label,
              description: pricing.description,
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/post-a-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/post-a-job`,
      metadata: {
        jobId,
        plan,
      },
    })

    // Create pending payment record
    const { databases } = createAdminClient()
    await databases.createDocument(DATABASE_ID, PAYMENTS_COLLECTION_ID, ID.unique(), {
      stripe_session_id: session.id,
      amount: pricing.amount,
      plan,
      job_id: jobId,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
