import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/appwrite-server'
import { Account } from 'node-appwrite'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Appwrite allows admin clients to create a session if we initialize an Account object with them
    const { users } = createAdminClient()
    // Wait, createEmailPasswordSession is actually part of Account API, not Users API.
    // Node-appwrite Client can initialize Account too!
    const client = require('@/lib/appwrite-server').createAdminClient() // We'll bypass and just init Account locally for ease
    const { Client, Account: ServerAccount } = require('node-appwrite')
    
    // We use standard endpoint and project to create the session to get the token
    const authClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    
    const account = new ServerAccount(authClient)
    
    const sessionResponse = await account.createEmailPasswordSession(email, password)

    // Store the session secret in Next.js cookies to be read by Server Components!
    cookies().set('appwrite-session', sessionResponse.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(sessionResponse.expire) // Ensure we honor the session expiry
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 401 })
  }
}
