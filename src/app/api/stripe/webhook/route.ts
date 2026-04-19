import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, PAYMENTS_COLLECTION_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { jobId, plan } = session.metadata || {}

    if (!jobId || !plan) {
      console.error('Missing metadata in Stripe session')
      return NextResponse.json({ received: true })
    }

    const { databases } = createAdminClient()

    // Find and update payment
    const { documents } = await databases.listDocuments(DATABASE_ID, PAYMENTS_COLLECTION_ID, [
      Query.equal('stripe_session_id', session.id)
    ])
    
    if (documents.length > 0) {
      await databases.updateDocument(DATABASE_ID, PAYMENTS_COLLECTION_ID, documents[0].$id, {
        status: 'paid',
        stripe_payment_intent: session.payment_intent as string,
      })
    }

    // Mark job as featured if featured plan
    if (plan === 'featured') {
      try {
        await databases.updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId, {
          is_featured: true
        })
      } catch (err) {
        console.error('Failed to feature job', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
