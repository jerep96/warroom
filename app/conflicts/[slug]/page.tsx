import Link from 'next/link'
import { notFound } from 'next/navigation'
import conflictsData from '@/data/conflicts.json'
import { Conflict, EventColor, PartyRole, Severity } from '@/types'
import SingleMapClient from '@/components/Map/SingleMapClient'

const conflicts = conflictsData as Conflict[]

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

export function generateStaticParams() {
  return conflicts.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const conflict = conflicts.find((c) => c.slug === slug)
  if (!conflict) return {}
  return { title: `${conflict.name} | WARROOM` }
}

export default async function ConflictDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const conflict = conflicts.find((c) => c.slug === slug)
  if (!conflict) notFound()

  const color = severityColor[conflict.severity]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080a0d',
        color: '#cdd6e0',
      }}
    >
      {/* Top nav */}
      <div
        style={{
          background: '#0d1117',
          borderBottom: '1px solid #1a2332',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: '20px',
            color: '#e74c3c',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textShadow: '0 0 12px rgba(231,76,60,0.4)',
          }}
        >
          WARROOM
        </Link>
        <span style={{ color: '#1a2332', fontSize: '16px' }}>/</span>
        <Link
          href="/conflicts"
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4a5568',
            textDecoration: 'none',
            letterSpacing: '0.1em',
          }}
        >
          CONFLICTS
        </Link>
        <span style={{ color: '#1a2332', fontSize: '16px' }}>/</span>
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#cdd6e0',
            letterSpacing: '0.1em',
          }}
        >
          {conflict.name.toUpperCase()}
        </span>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', height: 'calc(100vh - 53px)' }}>
        {/* Left: map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <SingleMapClient conflict={conflict} />
        </div>

        {/* Right: detail */}
        <div
          style={{
            width: '440px',
            flexShrink: 0,
            borderLeft: '1px solid #1a2332',
            overflowY: 'auto',
            background: '#0d1117',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '24px 24px 16px',
              borderBottom: '1px solid #1a2332',
            }}
          >
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '10px',
                color: '#4a5568',
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}
            >
              {conflict.region} // {conflict.since}–PRESENT
            </div>
            <h1
              style={{
                fontFamily: '"Bebas Neue", cursive',
                fontSize: '34px',
                color: '#cdd6e0',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '0.03em',
              }}
            >
              {conflict.name}
            </h1>
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '9px',
                  color: color,
                  border: `1px solid ${color}`,
                  padding: '2px 8px',
                  letterSpacing: '0.1em',
                }}
              >
                {conflict.severity.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '11px',
                  color: color,
                  letterSpacing: '0.08em',
                }}
              >
                {conflict.status}
              </span>
            </div>
          </div>

          {/* Threat bar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1a2332' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}
            >
              THREAT INTENSITY // {conflict.threat}/100
            </div>
            <div style={{ height: '6px', background: '#1a2332', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${conflict.threat}%`,
                  background: 'linear-gradient(to right, #27ae60, #f39c12, #e74c3c)',
                }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: '#1a2332',
              borderBottom: '1px solid #1a2332',
            }}
          >
            {[
              { label: 'CASUALTIES', value: conflict.casualties, color: '#e74c3c' },
              { label: 'DISPLACED', value: conflict.displaced, color: '#f39c12' },
              { label: 'SANCTIONS', value: conflict.sanctions, color: '#2980b9' },
              { label: 'DURATION', value: conflict.duration, color: '#cdd6e0' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#0d1117', padding: '14px' }}>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: '#4a5568',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '18px',
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Context */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a2332' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.15em',
                marginBottom: '10px',
              }}
            >
              SITUATION OVERVIEW
            </div>
            <p
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                color: '#cdd6e0',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {conflict.context}
            </p>
          </div>

          {/* Parties */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1a2332' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.15em',
                marginBottom: '12px',
              }}
            >
              PARTIES INVOLVED
            </div>
            {conflict.parties.map((party, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: i < conflict.parties.length - 1 ? '10px' : 0,
                  padding: '8px',
                  background: '#080a0d',
                  border: '1px solid #1a2332',
                }}
              >
                <span style={{ fontSize: '18px' }}>{party.flag}</span>
                <span
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '13px',
                    color: '#cdd6e0',
                    flex: 1,
                  }}
                >
                  {party.name}
                </span>
                <span
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: roleColorMap[party.role],
                    border: `1px solid ${roleColorMap[party.role]}`,
                    padding: '2px 8px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {party.role}
                </span>
              </div>
            ))}
          </div>

          {/* Full events timeline */}
          <div style={{ padding: '20px 24px' }}>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4a5568',
                letterSpacing: '0.15em',
                marginBottom: '16px',
              }}
            >
              EVENTS TIMELINE
            </div>
            {conflict.events.map((event, i) => {
              const evColor = eventColorMap[event.color]
              const isLast = i === conflict.events.length - 1
              return (
                <div
                  key={i}
                  style={{ display: 'flex', gap: '14px', marginBottom: isLast ? 0 : '16px' }}
                >
                  {/* Timeline */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: evColor,
                        marginTop: '2px',
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${evColor}`,
                      }}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: '1px',
                          flex: 1,
                          background: '#1a2332',
                          marginTop: '5px',
                          minHeight: '20px',
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontFamily: '"Share Tech Mono", monospace',
                          fontSize: '9px',
                          color: '#4a5568',
                        }}
                      >
                        T-{event.time}
                      </span>
                      <span
                        style={{
                          fontFamily: '"Share Tech Mono", monospace',
                          fontSize: '12px',
                          color: evColor,
                          lineHeight: 1.3,
                        }}
                      >
                        {event.title}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '12px',
                        color: '#4a5568',
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {event.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
