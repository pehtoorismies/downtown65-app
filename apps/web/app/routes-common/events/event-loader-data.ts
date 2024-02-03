import type { User } from '~/domain/user'
import type { EventType } from '~/generated/graphql'

export interface EventLoaderData {
  createdBy: User
  dateStart: string
  description: string
  id: string
  isRace: boolean
  location: string
  me?: User
  participants: User[]
  subtitle: string
  timeStart?: string
  title: string
  type: EventType
}
