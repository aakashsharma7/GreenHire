import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: job, error } = await supabaseAdmin
    .from('jobs')
    .update({
      status: 'rejected',
    })
    .eq('id', params.id)
    .select('*')
    .single()

  if (error || !job) {
    return NextResponse.json({ error: 'Failed to reject job' }, { status: 500 })
  }

  // Could send a rejection email here if desired, but specification doesn't require a specific template

  return NextResponse.json({ success: true, job })
}
