'use client'

import { useEffect, useState } from 'react'
import { fetchRecentNews } from '@/lib/reliefweb'
import { NewsItem } from '@/app/api/news/route'

const FALLBACK_NEWS = [
  'BBC // Artillery exchange reported along eastern front — civilian infrastructure targeted',
  'BBC // UN warns of imminent famine as aid access remains severely restricted',
  'BBC // RSF advances in Khartoum region — 500,000 newly displaced in 72 hours',
  'BBC // Resistance forces capture strategic military outpost in Shan State',
  'BBC // JNIM attacks military convoy in northern Mali — 14 soldiers killed',
  'BBC // PLA conducts live-fire naval exercises near strait median line',
  'BBC // India reports multiple LoC violations — diplomatic channels strained',
  'BBC // Emergency session called to address escalating Sudan crisis',
]

export default function Ticker() {
  const [items, setItems] = useState<string[]>(FALLBACK_NEWS)

  useEffect(() => {
    fetchRecentNews().then((news: NewsItem[]) => {
      if (news.length > 0) {
        setItems(news.map((n) => `BBC // ${n.title}`))
      }
    })
  }, [])

  const text = [...items, ...items].join('   //   ')

  return (
    <div
      style={{
        background: '#000',
        borderBottom: '1px solid #1a2332',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Label */}
      <div
        style={{
          background: '#e74c3c',
          padding: '0 12px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#fff',
            fontWeight: 700,
            letterSpacing: '0.15em',
          }}
        >
          INTEL FEED
        </span>
      </div>

      {/* Scrolling text */}
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div
          className="ticker-animate"
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            paddingLeft: '100%',
          }}
        >
          <span
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#cdd6e0',
              letterSpacing: '0.05em',
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  )
}
