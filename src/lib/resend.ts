import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

export const FROM_EMAIL = 'GreenHire <noreply@greenhire.com>'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
