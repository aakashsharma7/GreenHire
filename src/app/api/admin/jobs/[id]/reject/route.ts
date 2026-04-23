import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { databases } = createAdminClient()
    const job = await databases.updateDocument(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      params.id,
      { status: 'rejected' }
    )

    return NextResponse.json({ success: true, job: { ...job, id: job.$id } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reject job' }, { status: 500 })
  }
}
