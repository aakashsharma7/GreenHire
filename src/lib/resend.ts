import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const FROM_EMAIL = 'GreenHire <noreply@greenhire.com>'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
