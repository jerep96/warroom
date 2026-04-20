'use client'

interface StatBlockProps {
  label: string
  value: string
  color?: 'red' | 'amber' | 'blue' | 'white'
}

const colorMap = {
  red: '#e74c3c',
  amber: '#f39c12',
  blue: '#2980b9',
  white: '#cdd6e0',
}

export default function StatBlock({ label, value, color = 'white' }: StatBlockProps) {
  return (
    <div
      className="p-3"
      style={{
        background: '#0d1117',
        border: '1px solid #1a2332',
      }}
    >
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#4a5568',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '18px',
          color: colorMap[color],
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}
