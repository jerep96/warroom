import type { MetadataRoute } from 'next'
import conflicts from '@/data/conflicts.json'

const BASE_URL = 'https://warroom-dusky.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const conflictUrls = conflicts.map((c) => ({
    url: `${BASE_URL}/conflicts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/conflicts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...conflictUrls,
  ]
}
