export interface Job {
  $id?: string
  $createdAt?: string
  $updatedAt?: string
  id: string
  title: string
  company_name: string
  company_logo_url: string | null
  description: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  location: string
  is_remote: boolean
  salary_min: number | null
  salary_max: number | null
  apply_url: string
  contact_email?: string
  status: 'pending' | 'live' | 'expired' | 'rejected'
  is_featured: boolean
  stripe_payment_id: string | null
  posted_at: string
  expires_at: string
  created_at: string
}

export interface Subscriber {
  $id?: string
  $createdAt?: string
  $updatedAt?: string
  id: string
  email: string
  confirmed: boolean
  confirmation_token?: string
  created_at: string
}

export interface Payment {
  $id?: string
  $createdAt?: string
  $updatedAt?: string
  id: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  amount: number
  plan: 'single' | 'bundle' | 'featured'
  job_id: string
  status: 'pending' | 'paid' | 'failed'
  created_at: string
}

export type JobFilters = {
  search?: string
  job_type?: string
  is_remote?: boolean
  salary_min?: number
  salary_max?: number
  sort?: 'latest' | 'featured'
}

export type PricingPlan = 'single' | 'bundle' | 'featured'
