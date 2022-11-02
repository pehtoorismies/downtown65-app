import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'

export interface EventLoaderData {
  createdBy: User
  description: string
  id: string
  isRace: boolean
  location: string
  me?: User
  participants: User[]
  title: string
  type: EventType
}
