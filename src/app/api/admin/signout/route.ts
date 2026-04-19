import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionClient } from '@/lib/appwrite-server'
import { Account } from 'node-appwrite'

export async function POST() {
  const sessionCookie = cookies().get('appwrite-session')

  if (sessionCookie?.value) {
    try {
      // In Appwrite, destroying a session requires an Account instance.
      const { databases } = createSessionClient(sessionCookie.value)
      
      // Since createSessionClient only exposed databases, let's init Account directly for logout
      const { Client, Account: ServerAccount } = require('node-appwrite')
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setSession(sessionCookie.value)
        
      const account = new ServerAccount(client)
      await account.deleteSession('current')
    } catch {
      // Ignore errors (e.g. session already invalid)
    }
  }

  // Clear cookie regardless
  cookies().delete('appwrite-session')

  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'))
}
