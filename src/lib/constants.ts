// Application constants (e.g., SPORT_TYPES)

/**
 * Sport types constants
 * Maps to the sport_type enum in the database
 */

export const SPORT_TYPES = [
  { value: 'soccer', label: 'Soccer' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'football', label: 'Football' },
  { value: 'hockey', label: 'Hockey' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'golf', label: 'Golf' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'other', label: 'Other' },
] as const

export type SportType = typeof SPORT_TYPES[number]['value']

/**
 * LED-style sport colors for scoreboard aesthetic
 * Each sport has a distinct "glow" color
 */
export const SPORT_COLORS: Record<SportType, { bg: string; glow: string; text: string }> = {
  soccer: { bg: 'bg-green-500', glow: 'shadow-green-500/50', text: 'text-green-400' },
  basketball: { bg: 'bg-amber-500', glow: 'shadow-amber-500/50', text: 'text-amber-400' },
  tennis: { bg: 'bg-lime-500', glow: 'shadow-lime-500/50', text: 'text-lime-400' },
  baseball: { bg: 'bg-red-500', glow: 'shadow-red-500/50', text: 'text-red-400' },
  football: { bg: 'bg-amber-700', glow: 'shadow-amber-700/50', text: 'text-amber-500' },
  hockey: { bg: 'bg-blue-500', glow: 'shadow-blue-500/50', text: 'text-blue-400' },
  volleyball: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50', text: 'text-yellow-400' },
  golf: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50', text: 'text-emerald-400' },
  swimming: { bg: 'bg-cyan-500', glow: 'shadow-cyan-500/50', text: 'text-cyan-400' },
  other: { bg: 'bg-gray-500', glow: 'shadow-gray-500/50', text: 'text-gray-400' },
}
