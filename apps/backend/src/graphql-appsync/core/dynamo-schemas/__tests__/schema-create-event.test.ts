import { ISODate, ISOTime } from '@downtown65-app/time'
import { EventType } from '@downtown65-app/types'
import { describe, expect, it, test } from 'vitest'
import { EventCreateSchema } from '../event-schema'

const createSchema: EventCreateSchema = {
  PK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  SK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  GSI1PK: 'EVENT#FUTURE',
  GSI1SK: 'DATE#2023-02-02T09:30:00#01GW4MMH',
  eventId: '01GW4MMH6S4RXM9GSW37CC0HXP',
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'auth0|some_id',
  },
  dateStart: ISODate.parse('2023-02-02'),
  location: 'Sipoo   ',
  participants: {
    'auth0|12341234': {
      joinedAt: '2023-01-24T14:11:32',
      nickname: 'some_nick',
      picture:
        'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
      id: 'auth0|12341234',
    },
  },
  race: false,
  subtitle: 'Some subtitle',
  timeStart: ISOTime.parse('09:30'),
  title: ' Title',
  type: EventType.Karonkka,
}

interface CreateData {
  description: string
  data: EventCreateSchema
  failKey: keyof EventCreateSchema
}

describe('Dt65EventSchema', () => {
  describe('Dt65EventCreateSchema', () => {
    const createTestData: CreateData[] = [
      {
        description: 'Wrong PK',
        data: {
          ...createSchema,
          PK: 'EVENT#some_id',
        },
        failKey: 'PK',
      },
      {
        description: 'Wrong SK',
        data: {
          ...createSchema,
          SK: 'EVENT#some_id',
        },
        failKey: 'SK',
      },
      {
        description: 'SK and PK do not match',
        data: {
          ...createSchema,
          PK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
          SK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXX',
        },
        failKey: 'PK',
      },
      {
        description: 'Wrong GSK1SK',
        data: {
          ...createSchema,
          GSI1SK: 'EVENT#KOIRA',
        },
        failKey: 'GSI1SK',
      },
      {
        description: 'Wrong GSK1SK, incorrect id',
        data: {
          ...createSchema,
          GSI1SK: 'DATE#2023-02-02T00:00:00#hevonen',
        },
        failKey: 'GSI1SK',
      },
      {
        description: 'Wrong GSK1SK, no timeStart',
        data: {
          ...createSchema,
          GSI1SK: 'DATE#2023-02-02#01GW4MMH',
        },
        failKey: 'GSI1SK',
      },
      {
        description: 'Wrong eventId',
        data: {
          ...createSchema,
          eventId: 'Kissa',
        },
        failKey: 'eventId',
      },
      {
        description: 'Wrong participant key',
        data: {
          ...createSchema,
          participants: {
            koira: {
              joinedAt: '2023-02-02T00:00:00',
              nickname: 'koira',
              id: 'auth0|123',
              picture: 'https://server.com/kissa.gif',
            },
          },
        },
        failKey: 'participants',
      },
      {
        description: 'Wrong participant id',
        data: {
          ...createSchema,
          participants: {
            ['auth0|123']: {
              joinedAt: '2023-02-02T00:00:00',
              nickname: 'koira',
              id: 'koira',
              picture: 'https://server.com/kissa.gif',
            },
          },
        },
        failKey: 'participants',
      },
      {
        description: 'Wrong participant picture url',
        data: {
          ...createSchema,
          participants: {
            ['auth0|123']: {
              joinedAt: '2023-02-02T00:00:00',
              nickname: 'koira',
              id: 'auth0|123',
              picture: 'server.com/kissa.gif',
            },
          },
        },
        failKey: 'participants',
      },
      {
        description: 'Wrong participant joinedAt',
        data: {
          ...createSchema,
          participants: {
            ['auth0|123']: {
              joinedAt: '2023-02-02',
              nickname: 'koira',
              id: 'auth0|123',
              picture: 'server.com/kissa.gif',
            },
          },
        },
        failKey: 'participants',
      },
      {
        description: 'Wrong createdAt id',
        data: {
          ...createSchema,
          createdBy: {
            nickname: 'some_nick',
            picture:
              'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
            id: 'koira|123',
          },
        },
        failKey: 'createdBy',
      },
      {
        description: 'Wrong createdAt picture',
        data: {
          ...createSchema,
          createdBy: {
            nickname: 'some_nick',
            picture: 'kissa',
            id: 'auth0|123',
          },
        },
        failKey: 'createdBy',
      },
    ]

    it('should succeed', () => {
      const { title, location } = EventCreateSchema.parse(createSchema)
      expect(title).toBe('Title')
      expect(location).toBe('Sipoo')

      const noTimeStart = {
        ...createSchema,
        timeStart: undefined,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
      }
      EventCreateSchema.parse(noTimeStart)
    })

    test.each(createTestData)('$description', ({ data, failKey }) => {
      const result = EventCreateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })
})
