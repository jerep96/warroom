const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// Events store an ISO date: "2026-11-03", or "2026-11" when only the month
// is known. Older entries used relative offsets ("6h", "2d"), which go stale
// in static data; those still render as "T-<offset>".
export function formatEventTime(time: string): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(time)
  if (!m) return `T-${time}`
  const month = MONTHS[Number(m[2]) - 1]
  return m[3] ? `${m[3]} ${month} ${m[1]}` : `${month} ${m[1]}`
}
