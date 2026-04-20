'use client'

import dynamic from 'next/dynamic'
import { Conflict } from '@/types'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function SingleMapClient({ conflict }: { conflict: Conflict }) {
  return (
    <Map
      conflicts={[conflict]}
      selected={conflict}
      onSelect={() => {}}
    />
  )
}
