import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, SUBSCRIBERS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?subscribed=error', request.url))
  }

  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(DATABASE_ID, SUBSCRIBERS_COLLECTION_ID, [
      Query.equal('confirmation_token', token),
      Query.limit(1)
    ])

    if (documents.length === 0) {
      return NextResponse.redirect(new URL('/?subscribed=error', request.url))
    }

    await databases.updateDocument(DATABASE_ID, SUBSCRIBERS_COLLECTION_ID, documents[0].$id, {
      confirmed: true,
      confirmation_token: null
    })
  } catch (error) {
    return NextResponse.redirect(new URL('/?subscribed=error', request.url))
  }

  return NextResponse.redirect(new URL('/?subscribed=true', request.url))
}
