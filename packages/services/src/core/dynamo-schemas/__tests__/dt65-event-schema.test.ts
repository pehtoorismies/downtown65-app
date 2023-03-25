import { describe, expect, it, test } from 'vitest'
import { EventType } from '~/appsync.gen'
import {
  Dt65EventCreateSchema,
  Dt65EventUpdateSchema,
} from '~/core/dynamo-schemas/dt65-event-schema'

const createSchema: Dt65EventCreateSchema = {
  PK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  SK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  GSI1PK: 'EVENT#FUTURE',
  GSI1SK: 'DATE#2023-02-02T09:30:00#01GW4MMH',
  id: '01GW4MMH6S4RXM9GSW37CC0HXP',
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'auth0|some_id',
  },
  dateStart: '2023-02-02',
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
  timeStart: '09:30',
  title: ' Title',
  type: EventType.Karonkka,
}

const updateSchema: Dt65EventUpdateSchema = {
  PK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  SK: 'EVENT#01GW4MMH6S4RXM9GSW37CC0HXP',
  GSI1SK: 'DATE#2023-02-02T09:30:00#01GW4MMH',
  dateStart: '2023-02-02',
  location: 'Sipoo   ',
  race: false,
  subtitle: 'Some subtitle',
  timeStart: '09:30',
  title: ' Title',
  type: EventType.Karonkka,
}

interface CreateData {
  description: string
  data: Dt65EventCreateSchema
  failKey: keyof Dt65EventCreateSchema
}

interface UpdateData {
  description: string
  data: Dt65EventUpdateSchema
  failKey: keyof Dt65EventUpdateSchema
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
        description: 'SK and  PK do not match',
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
        description: 'Wrong dateStart',
        data: {
          ...createSchema,
          dateStart: '2023-30-30',
        },
        failKey: 'dateStart',
      },
      {
        description: 'Wrong dateStart',
        data: {
          ...createSchema,
          dateStart: '2023-30',
        },
        failKey: 'dateStart',
      },
      {
        description: 'Wrong timeStart',
        data: {
          ...createSchema,
          timeStart: '24:30',
        },
        failKey: 'timeStart',
      },
      {
        description: 'Wrong id',
        data: {
          ...createSchema,
          id: 'Kissa',
        },
        failKey: 'id',
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
      const { title, location } = Dt65EventCreateSchema.parse(createSchema)
      expect(title).toBe('Title')
      expect(location).toBe('Sipoo')

      const noTimeStart = {
        ...createSchema,
        timeStart: undefined,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
      }
      Dt65EventCreateSchema.parse(noTimeStart)
    })

    test.each(createTestData)('$description', ({ data, failKey }) => {
      const result = Dt65EventCreateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })

  const updateTestData: UpdateData[] = [
    {
      description: 'Wrong PK',
      data: {
        ...updateSchema,
        PK: 'EVENT#some_id',
      },
      failKey: 'PK',
    },
    {
      description: 'Wrong PK',
      data: {
        ...updateSchema,
        SK: 'EVENT#some_id',
      },
      failKey: 'SK',
    },
  ]

  describe('Dt65EventUpdateSchema', () => {
    it('should succeed', () => {
      const { title, location } = Dt65EventUpdateSchema.parse(updateSchema)
      expect(title).toBe('Title')
      expect(location).toBe('Sipoo')

      const noTimeStart = {
        ...createSchema,
        timeStart: undefined,
        GSI1SK: 'DATE#2023-02-02T00:00:00#01GW4MMH',
      }
      Dt65EventCreateSchema.parse(noTimeStart)
    })

    test.each(updateTestData)('$description', ({ data, failKey }) => {
      const result = Dt65EventUpdateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })
})
