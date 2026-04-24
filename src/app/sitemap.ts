import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/appwrite-server'
import { DATABASE_ID, JOBS_COLLECTION_ID } from '@/lib/appwrite'
import { Query } from 'node-appwrite'

// Force dynamic so this is generated at request-time, not build-time.
// Appwrite credentials are only available as real env vars at runtime on Vercel.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenhire.com'

  // Fetch all live jobs
  let jobs: any[] = []
  try {
    const { databases } = createAdminClient()
    const { documents } = await databases.listDocuments(
      DATABASE_ID,
      JOBS_COLLECTION_ID,
      [
        Query.equal('status', 'live'),
        Query.greaterThan('expires_at', new Date().toISOString()),
        Query.select(['$id', '$updatedAt', '$createdAt'])
      ]
    )
    jobs = documents.map((d) => ({ ...d, id: d.$id, updated_at: d.$updatedAt, created_at: d.$createdAt }))
  } catch (error) {
    console.error('Failed to fetch jobs for sitemap:', error)
  }

  const jobUrls = jobs.map((job: { id: string; updated_at?: string; created_at?: string }) => ({
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
