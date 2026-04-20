import { NextResponse } from 'next/server'

export interface NewsItem {
  title: string
  pubDate: string
  link: string
  description: string
}

interface Rss2JsonItem {
  title?: string
  pubDate?: string
  link?: string
  description?: string
}

interface Rss2JsonResponse {
  status: string
  items?: Rss2JsonItem[]
}

let cache: { data: NewsItem[]; timestamp: number } | null = null
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  try {
    const rssUrl = encodeURIComponent('https://feeds.bbci.co.uk/news/world/rss.xml')
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&count=20`,
      { next: { revalidate: 1800 } }
    )

    if (!res.ok) throw new Error('rss2json error')

    const json: Rss2JsonResponse = await res.json()
    if (json.status !== 'ok' || !json.items) throw new Error('Invalid response')

    const items: NewsItem[] = json.items.map((item) => ({
      title: item.title || '',
      pubDate: item.pubDate || '',
      link: item.link || '',
      description: item.description || '',
    }))

    cache = { data: items, timestamp: Date.now() }
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}
