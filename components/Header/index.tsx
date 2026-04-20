'use client'

import { useEffect, useState } from 'react'

interface HeaderProps {
  wikiLastEdited?: string
}

function hoursAgo(isoTimestamp: string): string {
  const diff = Date.now() - new Date(isoTimestamp).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours === 1) return '1h ago'
  return `${hours}h ago`
}

export default function Header({ wikiLastEdited }: HeaderProps) {
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getUTCHours().toString().padStart(2, '0')
      const m = now.getUTCMinutes().toString().padStart(2, '0')
      const s = now.getUTCSeconds().toString().padStart(2, '0')
      setUtcTime(`${h}:${m}:${s}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      style={{
        background: '#0d1117',
        borderBottom: '1px solid #1a2332',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo + subtitle */}
      <div>
        <div
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: '28px',
            color: '#e74c3c',
            lineHeight: 1,
            textShadow: '0 0 20px rgba(231,76,60,0.5), 0 0 40px rgba(231,76,60,0.2)',
            letterSpacing: '0.05em',
          }}
        >
          WARROOM
        </div>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginTop: '2px',
          }}
        >
          GLOBAL CONFLICT MONITOR // UNCLASSIFIED
        </div>
      </div>

      {/* Hero stats */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {[
          { label: 'ACTIVE CONFLICTS', value: '34' },
          { label: 'COUNTRIES AFFECTED', value: '189' },
          { label: 'SANCTIONS IMPOSED', value: '2,400+' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '20px',
                color: '#cdd6e0',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.1em',
                marginTop: '3px',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ko-fi */}
      <a
        href="https://ko-fi.com/TU_URL"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#f39c12',
          border: '1px solid #f39c12',
          padding: '4px 10px',
          letterSpacing: '1px',
          textDecoration: 'none',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        SUPPORT ◈
      </a>

      {/* UTC Clock + Wiki timestamp */}
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '22px',
            color: '#27ae60',
            lineHeight: 1,
          }}
        >
          {utcTime || '00:00:00'}
        </div>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginTop: '3px',
          }}
        >
          UTC // ZULU TIME
        </div>
        {wikiLastEdited && (
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#2980b9',
              letterSpacing: '0.1em',
              marginTop: '4px',
            }}
          >
            WIKI UPDATED: {hoursAgo(wikiLastEdited)}
          </div>
        )}
      </div>
    </header>
  )
}
