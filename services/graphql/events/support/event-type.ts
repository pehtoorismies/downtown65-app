export const EVENT_TYPES = [
  'KARONKKA',
  'MEETING',
  'NORDIC_WALKING',
  'ORIENTEERING',
  'OTHER',
  'RUNNING',
  'SKIING',
  'SPINNING',
  'SWIMMING',
  'TRACK_RUNNING',
  'TRAIL_RUNNING',
  'TRIATHLON',
  'ULTRAS',
] as const

export type EventType = typeof EVENT_TYPES[number]
