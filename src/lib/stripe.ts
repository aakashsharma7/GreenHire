import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
})

export const PRICING = {
  single: { amount: 29900, label: 'Single Post', description: '30-day listing' },
  bundle: { amount: 69900, label: 'Bundle (3 Posts)', description: 'Save $200' },
  featured: { amount: 39900, label: 'Featured Post', description: 'Pinned to top + gold highlight + 30 days' },
} as const
