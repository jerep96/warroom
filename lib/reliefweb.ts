import { NewsItem } from '@/app/api/news/route'

export async function fetchRecentNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch('/api/news', { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
