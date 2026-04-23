import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, SUBSCRIBERS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = unsubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 422 })
  }

  const { email } = parsed.data

  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      SUBSCRIBERS_COLLECTION_ID,
      [Query.equal('email', email), Query.limit(1)]
    )

    if (documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        SUBSCRIBERS_COLLECTION_ID,
        documents[0].$id
      )
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
