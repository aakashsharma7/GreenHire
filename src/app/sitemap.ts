import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhire.com'

  // Fetch all live jobs
  const { data: jobs } = await supabaseAdmin
    .from('jobs')
    .select('id, updated_at, created_at')
    .eq('status', 'live')
    .gt('expires_at', new Date().toISOString())

  const jobUrls = (jobs || []).map((job: { id: string; updated_at?: string; created_at?: string }) => ({
    url: `${siteUrl}/jobs/${job.id}`,
    lastModified: job.updated_at || job.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticPages = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/post-a-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ]

  return [...staticPages, ...jobUrls]
}
