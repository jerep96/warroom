'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Conflict, EventColor, PartyRole, Severity } from '@/types'

interface ConflictDetailProps {
  conflict: Conflict | null
  onWikiLoaded?: (lastEdited: string) => void
}

interface WikiData {
  extract: string
  thumbnail: string | null
  lastEdited: string
}

const severityColor: Record<Severity, string> = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2980b9',
}

const eventColorMap: Record<EventColor, string> = {
  red: '#e74c3c',
  amber: '#f39c12',
  blue: '#2980b9',
  dim: '#4a5568',
}

const roleColorMap: Record<PartyRole, string> = {
  AGGRESSOR: '#e74c3c',
  DEFENDER: '#2980b9',
  SUPPORTER: '#f39c12',
  MEDIATOR: '#27ae60',
}

function statusColor(status: string): string {
  if (status.toLowerCase().includes('active')) return '#e74c3c'
  if (status.toLowerCase().includes('tension')) return '#f39c12'
  return '#2980b9'
}

export default function ConflictDetail({ conflict, onWikiLoaded }: ConflictDetailProps) {
  const [wiki, setWiki] = useState<WikiData | null>(null)
  const [wikiLoading, setWikiLoading] = useState(false)

  useEffect(() => {
    if (!conflict) {
      setWiki(null)
      return
    }
    setWiki(null)
    setWikiLoading(true)
    fetch(`/api/wiki/${conflict.slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: WikiData | null) => {
        if (data && !('error' in data)) {
          setWiki(data)
          onWikiLoaded?.(data.lastEdited)
        }
      })
      .catch(() => null)
      .finally(() => setWikiLoading(false))
  }, [conflict?.slug])

  if (!conflict) {
    return (
      <div
        style={{
          width: '300px',
          flexShrink: 0,
          background: '#0d1117',
          borderLeft: '1px solid #1a2332',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4a5568',
            letterSpacing: '0.1em',
          }}
        >
          SELECT CONFLICT
        </span>
      </div>
    )
  }

  const dotColor = statusColor(conflict.status)

  return (
    <div
      style={{
        width: '300px',
        flexShrink: 0,
        background: '#0d1117',
        borderLeft: '1px solid #1a2332',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header section */}
      <div style={{ padding: '16px', borderBottom: '1px solid #1a2332' }}>
        <div
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: '26px',
            color: '#cdd6e0',
            lineHeight: 1.05,
            letterSpacing: '0.03em',
            marginBottom: '4px',
          }}
        >
          {conflict.name}
        </div>

        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4a5568',
            letterSpacing: '0.1em',
            marginBottom: '10px',
          }}
        >
          {conflict.region} // SINCE {conflict.since}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
            }}
            className="animate-pulse-dot"
          />
          <span
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: dotColor,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {conflict.status}
          </span>
        </div>
      </div>

      {/* Threat bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a2332' }}>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginBottom: '6px',
          }}
        >
          THREAT INTENSITY
        </div>
        <div style={{ height: '4px', background: '#1a2332', position: 'relative' }}>
          <div
            className="threat-bar"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${conflict.threat}%`,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4a5568' }}>0</span>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: severityColor[conflict.severity] }}>
            {conflict.threat}/100
          </span>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4a5568' }}>100</span>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          borderBottom: '1px solid #1a2332',
          background: '#1a2332',
        }}
      >
        {[
          { label: 'CASUALTIES', value: conflict.casualties, color: '#e74c3c' },
          { label: 'DISPLACED', value: conflict.displaced, color: '#f39c12' },
          { label: 'SANCTIONS', value: conflict.sanctions, color: '#2980b9' },
          { label: 'DURATION', value: conflict.duration, color: '#cdd6e0' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#0d1117', padding: '10px 12px' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.1em',
                marginBottom: '4px',
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '14px',
                color: stat.color,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Wiki Brief */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a2332', background: '#0d1117', border: '1px solid #1a2332' }}>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginBottom: '8px',
          }}
        >
          WIKI BRIEF
        </div>

        {wikiLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[100, 85, 70].map((w) => (
              <div
                key={w}
                style={{
                  height: '9px',
                  background: '#1a2332',
                  width: `${w}%`,
                  borderRadius: '2px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}

        {!wikiLoading && wiki && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            {wiki.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={wiki.thumbnail}
                alt=""
                style={{
                  width: '56px',
                  height: '40px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '1px solid #1a2332',
                }}
              />
            )}
            <p
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px',
                color: '#cdd6e0',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {wiki.extract.length > 200 ? wiki.extract.slice(0, 200) + '…' : wiki.extract}
            </p>
          </div>
        )}

        {!wikiLoading && !wiki && (
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              color: '#cdd6e0',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {conflict.context}
          </p>
        )}
      </div>

      {/* Parties */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a2332' }}>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginBottom: '10px',
          }}
        >
          PARTIES INVOLVED
        </div>
        {conflict.parties.map((party, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
            <span style={{ fontSize: '14px' }}>{party.flag}</span>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#cdd6e0', flex: 1 }}>
              {party.name}
            </span>
            <span
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: roleColorMap[party.role],
                border: `1px solid ${roleColorMap[party.role]}`,
                padding: '1px 5px',
                letterSpacing: '0.05em',
              }}
            >
              {party.role}
            </span>
          </div>
        ))}
      </div>

      {/* Events timeline */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.15em',
            marginBottom: '12px',
          }}
        >
          RECENT EVENTS
        </div>
        {conflict.events.map((event, i) => {
          const color = eventColorMap[event.color]
          const isLast = i === conflict.events.length - 1
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: isLast ? 0 : '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: color,
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                {!isLast && (
                  <div style={{ width: '1px', flex: 1, background: '#1a2332', marginTop: '4px' }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4a5568' }}>
                    -{event.time}
                  </span>
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: color, lineHeight: 1.2 }}>
                    {event.title}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '11px',
                    color: '#4a5568',
                    lineHeight: 1.4,
                    paddingBottom: isLast ? 0 : '4px',
                  }}
                >
                  {event.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Link to detail */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1a2332' }}>
        <Link
          href={`/conflicts/${conflict.slug}`}
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#2980b9',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            display: 'block',
            textAlign: 'center',
            padding: '8px',
            border: '1px solid #1a2332',
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLElement).style.borderColor = '#e74c3c'
            ;(e.target as HTMLElement).style.color = '#e74c3c'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLElement).style.borderColor = '#1a2332'
            ;(e.target as HTMLElement).style.color = '#2980b9'
          }}
        >
          VIEW FULL REPORT →
        </Link>
      </div>
    </div>
  )
}
