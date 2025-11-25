import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get today's date in YYYY-MM-DD format using UTC timezone.
 * This ensures consistent date calculation regardless of server timezone.
 * 
 * @returns {string} Today's date in YYYY-MM-DD format (UTC)
 */
export function getTodayDateUTC(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get today's date in YYYY-MM-DD format using a specific timezone.
 * This allows horoscopes to regenerate based on the user's local day.
 * 
 * @param timezone - IANA timezone identifier (e.g., "America/Los_Angeles", "America/New_York")
 * @param date - Optional Date object to format (defaults to now)
 * @returns {string} Date in YYYY-MM-DD format for the specified timezone
 */
export function getTodayDateInTimezone(timezone: string, date?: Date): string {
  const dateToFormat = date || new Date()
  
  // Format date in the specified timezone
  // Using toLocaleString with timezone option to get the date in that timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  // en-CA locale gives us YYYY-MM-DD format directly
  return formatter.format(dateToFormat)
}
