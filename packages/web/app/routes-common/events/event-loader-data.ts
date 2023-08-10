import type { EventType } from '@downtown65-app/graphql/appsync.gen'
import type { User } from '~/domain/user'

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
