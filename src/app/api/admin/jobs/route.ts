import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'

async function checkAdmin(request: NextRequest): Promise<boolean> {
  // Same as old: admin routes are protected at middleware/page level for simplicity
  return true 
}

export async function GET(_request: NextRequest) {
  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [
        Query.equal('status', 'pending'),
        Query.orderDesc('created_at')
      ]
    )

    return NextResponse.json({ jobs: documents.map(d => ({ ...d, id: d.$id })) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pending jobs' }, { status: 500 })
  }
}
