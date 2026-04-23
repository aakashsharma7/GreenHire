import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// This route handles the OAuth2 callback from Appwrite
// Appwrite redirects to: /api/auth/callback?userId=...&secret=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  if (!userId || !secret) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }

  try {
    const { Client, Account } = await import('node-appwrite')
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://dummy.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy_project')

    const account = new Account(client)

    // Exchange userId + secret for a real session
    const session = await account.createSession(userId, secret)

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(session.expire),
    })

    return NextResponse.redirect(new URL('/', request.url))
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
  }
}
