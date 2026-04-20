import type { Metadata } from 'next'
import Link from 'next/link'
import conflictsData from '@/data/conflicts.json'
import { Conflict, Severity } from '@/types'

const conflicts = conflictsData as Conflict[]

export const metadata: Metadata = {
  title: 'All Active Conflicts',
  description: 'Complete list of ongoing armed conflicts worldwide. Browse wars, insurgencies and geopolitical tensions with real-time data on casualties and displaced people.',
}

const severityColor: Record<Severity, string> = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2980b9',
}

export default function ConflictsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080a0d',
        padding: '32px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/"
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          ← BACK TO MONITOR
        </Link>
        <h1
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: '40px',
            color: '#e74c3c',
            letterSpacing: '0.05em',
            margin: 0,
            textShadow: '0 0 20px rgba(231,76,60,0.4)',
          }}
        >
          CONFLICT INDEX
        </h1>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginTop: '4px',
          }}
        >
          {conflicts.length} MONITORED CONFLICTS // UPDATED CONTINUOUSLY
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1px',
          background: '#1a2332',
        }}
      >
        {conflicts.map((c) => {
          const color = severityColor[c.severity]
          return (
            <Link
              key={c.id}
              href={`/conflicts/${c.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="conflict-card"
                style={{
                  background: '#0d1117',
                  borderLeft: `3px solid ${color}`,
                  padding: '20px',
                  cursor: 'crosshair',
                }}
              >
                {/* Region */}
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: '#4a5568',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  {c.region} // {c.since}–
                </div>

                {/* Name */}
                <div
                  style={{
                    fontFamily: '"Bebas Neue", cursive',
                    fontSize: '22px',
                    color: '#cdd6e0',
                    lineHeight: 1.1,
                    letterSpacing: '0.04em',
                    marginBottom: '10px',
                  }}
                >
                  {c.name}
                </div>

                {/* Threat bar */}
                <div
                  style={{
                    height: '3px',
                    background: '#1a2332',
                    marginBottom: '12px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${c.threat}%`,
                      background: 'linear-gradient(to right, #27ae60, #f39c12, #e74c3c)',
                    }}
                  />
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '9px',
                      color: color,
                      border: `1px solid ${color}`,
                      padding: '2px 6px',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {c.severity.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '11px',
                      color: '#e74c3c',
                    }}
                  >
                    {c.casualties}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '10px',
                      color: '#4a5568',
                    }}
                  >
                    {c.status}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '10px',
                      color: color,
                      marginLeft: 'auto',
                    }}
                  >
                    T:{c.threat}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
