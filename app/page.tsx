'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Ticker from '@/components/Ticker'
import ConflictList from '@/components/ConflictList'
import ConflictDetail from '@/components/ConflictDetail'
import conflictsData from '@/data/conflicts.json'
import { Conflict } from '@/types'

const conflicts = conflictsData as Conflict[]

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        background: '#080a0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '1px solid #1a2332',
        borderRight: '1px solid #1a2332',
      }}
    >
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '12px',
          color: '#4a5568',
          letterSpacing: '0.2em',
          animation: 'pulse-dot 1.5s ease-in-out infinite',
        }}
      >
        LOADING MAP GRID...
      </div>
    </div>
  ),
})

export default function Home() {
  const [selected, setSelected] = useState<Conflict>(conflicts[0])
  const [wikiLastEdited, setWikiLastEdited] = useState<string>('')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#080a0d',
        overflow: 'hidden',
      }}
    >
      <Header wikiLastEdited={wikiLastEdited} />
      <Ticker />

      {/* Main 3-column layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ConflictList
          conflicts={conflicts}
          selected={selected}
          onSelect={setSelected}
        />
        <Map
          conflicts={conflicts}
          selected={selected}
          onSelect={setSelected}
        />
        <ConflictDetail conflict={selected} onWikiLoaded={setWikiLastEdited} />
      </div>
    </div>
  )
}
