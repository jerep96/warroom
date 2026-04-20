'use client'

import { Conflict, Severity } from '@/types'

interface ConflictListProps {
  conflicts: Conflict[]
  selected: Conflict | null
  onSelect: (conflict: Conflict) => void
}

const severityColor: Record<Severity, string> = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2980b9',
}

const severityBg: Record<Severity, string> = {
  high: 'rgba(231,76,60,0.08)',
  medium: 'rgba(243,156,18,0.08)',
  low: 'rgba(41,128,185,0.08)',
}

export default function ConflictList({ conflicts, selected, onSelect }: ConflictListProps) {
  return (
    <div
      style={{
        width: '280px',
        flexShrink: 0,
        background: '#0d1117',
        borderRight: '1px solid #1a2332',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1a2332',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#e74c3c',
            position: 'relative',
          }}
          className="animate-pulse-dot"
        />
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#cdd6e0',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          CONFLICT INDEX
        </span>
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4a5568',
            marginLeft: 'auto',
          }}
        >
          {conflicts.length} ACTIVE
        </span>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {[...conflicts].sort((a, b) => b.threat - a.threat).map((c) => {
          const isSelected = selected?.id === c.id
          const color = severityColor[c.severity]
          return (
            <div
              key={c.id}
              className="conflict-item"
              onClick={() => onSelect(c)}
              style={{
                borderLeft: `3px solid ${color}`,
                padding: '12px 16px',
                cursor: 'crosshair',
                background: isSelected ? severityBg[c.severity] : 'transparent',
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
                  marginBottom: '4px',
                }}
              >
                {c.region}
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: '"Bebas Neue", cursive',
                  fontSize: '17px',
                  color: isSelected ? color : '#cdd6e0',
                  lineHeight: 1.1,
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                }}
              >
                {c.name}
              </div>

              {/* Footer row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Severity badge */}
                <span
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: color,
                    border: `1px solid ${color}`,
                    padding: '1px 5px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {c.severity}
                </span>

                {/* Casualties */}
                <span
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '10px',
                    color: '#4a5568',
                  }}
                >
                  {(c.casualties.includes('(') ? c.casualties.split('(')[0].trim() : c.casualties).substring(0, 15)} cas.
                </span>

                {/* Threat */}
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
          )
        })}
      </div>
    </div>
  )
}
