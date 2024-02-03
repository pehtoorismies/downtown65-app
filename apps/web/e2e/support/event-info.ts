import type { EventType } from '~/generated/graphql'

export interface EventInfo {
  title: string
  subtitle: string
  location: string
  description: string
  type: EventType
  date: Date
  time: {
    hours: number
    minutes: number
  } | null
}
