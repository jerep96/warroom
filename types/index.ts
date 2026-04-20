export type Severity = 'high' | 'medium' | 'low'
export type PartyRole = 'AGGRESSOR' | 'DEFENDER' | 'SUPPORTER' | 'MEDIATOR'
export type EventColor = 'red' | 'amber' | 'blue' | 'dim'

export interface Party {
  flag: string
  name: string
  role: PartyRole
}

export interface ConflictEvent {
  time: string
  color: EventColor
  title: string
  desc: string
}

export interface Conflict {
  id: string
  name: string
  slug: string
  region: string
  severity: Severity
  status: string
  since: string
  lat: number
  lng: number
  casualties: string
  displaced: string
  sanctions: string
  duration: string
  threat: number
  context: string
  parties: Party[]
  events: ConflictEvent[]
}

export interface ReliefWebReport {
  id: string
  title: string
  date: string
  country: string
  url: string
}
