import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { databases } = createAdminClient()
    const doc = await databases.getDocument(DATABASE_ID, JOBS_COLLECTION_ID, params.id)
    
    if (doc.status !== 'live') {
      return NextResponse.json({ error: 'Job not live' }, { status: 404 })
    }

    return NextResponse.json({ job: { ...doc, id: doc.$id } })
  } catch (error) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
}
