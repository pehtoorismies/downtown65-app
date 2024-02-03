import { ISODate } from '@downtown65-app/time'
import { describe, expect, it, test } from 'vitest'
import { ChallengeCreateSchema } from '../challenge-schema'

interface CreateData {
  description: string
  data: ChallengeCreateSchema
  failKey: keyof ChallengeCreateSchema
}

const createSchema: ChallengeCreateSchema = {
  PK: 'CHALLENGE#01GW4MMH6S4RXM9GSW37CC0HXP',
  SK: 'CHALLENGE#01GW4MMH6S4RXM9GSW37CC0HXP',
  GSI1PK: 'CHALLENGE#CHALLENGE',
  GSI1SK: 'DATE#2024-02-29#01GW4MMH',
  id: '01GW4MMH6S4RXM9GSW37CC0HXP',
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'auth0|some_id',
  },
  dateStart: ISODate.parse('2024-02-01'),
  dateEnd: ISODate.parse('2024-02-29'),
  subtitle: 'Subtitle',
  title: ' Title',
  participants: {},
}

describe('ChallengeCreateSchema', () => {
  describe('create', () => {
    const createTestData: CreateData[] = [
      {
        description: 'Wrong PK',
        data: {
          ...createSchema,
          PK: 'CHALLENGE#some_id',
        },
        failKey: 'PK',
      },
      {
        description: 'Wrong SK',
        data: {
          ...createSchema,
          SK: 'CHALLENGE#some_id',
        },
        failKey: 'SK',
      },
      {
        description: 'SK and  PK do not match',
        data: {
          ...createSchema,
          PK: 'CHALLENGE#01GW4MMH6S4RXM9GSW37CC0HXP',
          SK: 'CHALLENGE#01GW4MMH6S4RXM9GSW37CC0HXX',
        },
        failKey: 'PK',
      },
      {
        description: 'Wrong GSK1SK',
        data: {
          ...createSchema,
          GSI1SK: 'CHALLENGE#KOIRA',
        },
        failKey: 'GSI1SK',
      },
      {
        description: 'Wrong GSK1SK, incorrect id',
        data: {
          ...createSchema,
          GSI1SK: 'DATE#2023-02-02#hevonen',
        },
        failKey: 'GSI1SK',
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
        description: 'dateStart after dateEnd',
        data: {
          ...createSchema,
          dateStart: ISODate.parse('2025-01-01'),
        },
        failKey: 'dateStart',
      },
    ]

    it('should be valid', () => {
      const { title, subtitle } = ChallengeCreateSchema.parse(createSchema)
      expect(title).toBe('Title')
      expect(subtitle).toBe('Subtitle')
    })

    test.each(createTestData)('$description', ({ data, failKey }) => {
      const result = ChallengeCreateSchema.safeParse(data)
      if (result.success) {
        throw new Error('Should fail')
      }
      expect(result.error.format()[failKey]).toBeDefined()
    })
  })
})
