// date-utils.ts

function toLocalDate(dateString: string): Date {
  if (!dateString) return new Date(NaN)

  if (/Z|[+-]\d{2}:\d{2}$/.test(dateString)) {
    return new Date(dateString)
  }

  const normalized = dateString.replace(' ', 'T')
  const [datePart, timePart = '00:00:00'] = normalized.split('T')

  const [year, month, day] = datePart.split('-').map(Number)
  const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number)

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
}

export function timeAgo(dateString: string): string {
  const date = toLocalDate(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} minutes`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hours`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} days`

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) return `${diffWeeks} weeks`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths} months`

  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} years`
}

/**
 * HH:mm
 */
export function toHHMM(dateString: string): string {
  const date = toLocalDate(dateString)

  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')

  return `${hh}:${mm}`
}

/**
 * YYYY-MM-DD
 */
export function toYYYYMMDD(dateString: string): string {
  const date = toLocalDate(dateString)

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd}`
}

/**
 * DD/MM/YYYY
 */
export function toDDMMYYYY(dateString: string): string {
  const date = toLocalDate(dateString)

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()

  return `${dd}/${mm}/${yyyy}`
}

export function getRemainingDays(dateString: string): number {
  const date = toLocalDate(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
