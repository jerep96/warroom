'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { Conflict, Severity } from '@/types'

interface MapProps {
  conflicts: Conflict[]
  selected: Conflict | null
  onSelect: (conflict: Conflict) => void
}

const severityColor: Record<Severity, string> = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2980b9',
}

function createMarkerHtml(color: string, isSelected: boolean): string {
  const size = isSelected ? 16 : 12
  const innerSize = isSelected ? 10 : 8
  return `
    <div style="position:relative;width:${size}px;height:${size}px">
      <div style="
        position:absolute;
        inset:0;
        border-radius:50%;
        background:${color};
        animation:ping 2s ease-out infinite;
        opacity:0.6
      "></div>
      <div style="
        position:absolute;
        top:${(size - innerSize) / 2}px;
        left:${(size - innerSize) / 2}px;
        width:${innerSize}px;
        height:${innerSize}px;
        border-radius:50%;
        background:${color};
        box-shadow: 0 0 8px ${color}
      "></div>
    </div>
  `
}

export default function MapComponent({ conflicts, selected, onSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map())
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return

    const L = require('leaflet')

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '© CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map)

    leafletMapRef.current = map

    // Fix: recalculate size after container is fully painted
    setTimeout(() => map.invalidateSize(), 100)

    // Add markers
    const bounds: [number, number][] = []

    conflicts.forEach((conflict) => {
      const color = severityColor[conflict.severity]
      const isSelected = selected?.id === conflict.id

      const icon = L.divIcon({
        html: createMarkerHtml(color, isSelected),
        className: '',
        iconSize: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        iconAnchor: [isSelected ? 8 : 6, isSelected ? 8 : 6],
      })

      const marker = L.marker([conflict.lat, conflict.lng], { icon })
        .addTo(map)
        .on('click', () => onSelect(conflict))

      markersRef.current.set(conflict.id, marker)
      bounds.push([conflict.lat, conflict.lng])
    })

    if (bounds.length === 1) {
      map.setView(bounds[0], 4)
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] })
    }

    // Track mouse coords
    map.on('mousemove', (e: { latlng: { lat: number; lng: number } }) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    return () => {
      map.remove()
      leafletMapRef.current = null
      markersRef.current.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when selection changes
  useEffect(() => {
    if (!leafletMapRef.current) return
    const L = require('leaflet')

    conflicts.forEach((conflict) => {
      const marker = markersRef.current.get(conflict.id)
      if (!marker) return

      const color = severityColor[conflict.severity]
      const isSelected = selected?.id === conflict.id

      const icon = L.divIcon({
        html: createMarkerHtml(color, isSelected),
        className: '',
        iconSize: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        iconAnchor: [isSelected ? 8 : 6, isSelected ? 8 : 6],
      })

      marker.setIcon(icon)
    })
  }, [selected, conflicts])

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative', background: '#080a0d' }}>
      {/* Map container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Grid overlay */}
      <div className="map-grid-overlay" />

      {/* Coordinates HUD */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(13,17,23,0.85)',
          border: '1px solid #1a2332',
          padding: '6px 10px',
          zIndex: 500,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#27ae60',
            letterSpacing: '0.08em',
          }}
        >
          LAT {coords.lat.toFixed(3)}° / LNG {coords.lng.toFixed(3)}°
        </div>
      </div>

      {/* Bottom attribution overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4a5568',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}
        >
          SOURCE: RELIEFWEB · UCDP · UN OCHA // DATA UPDATED CONTINUOUSLY
        </div>
      </div>
    </div>
  )
}
