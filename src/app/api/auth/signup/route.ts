import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { Account } from 'node-appwrite'
import { cookies } from 'next/headers'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      )
    }

    const { name, email, password } = parsed.data

    // Use node-appwrite Client directly (no admin key needed for account creation)
    const { Client, Account: NodeAccount, ID } = await import('node-appwrite')
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://dummy.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy_project')

    const account = new NodeAccount(client)

    // Create the user account
    await account.create(ID.unique(), email, password, name)

    // Immediately create a session
    const session = await account.createEmailPasswordSession(email, password)

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(session.expire),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    // Appwrite error codes
    if (err?.code === 409) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: err.message || 'Failed to create account' }, { status: 500 })
  }
}
