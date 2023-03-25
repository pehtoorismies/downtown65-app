import { ulid } from 'ulid'
import { describe, expect, it } from 'vitest'
import { transform } from '../dt65-event-schema'
import type { CreateEventInput } from '~/appsync.gen'
import { EventType } from '~/appsync.gen'

const creatableEvent: CreateEventInput = {
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'auth0|some_id',
  },
  dateStart: {
    year: 2018,
    month: 12,
    day: 13,
  },
  location: 'Sipoo',
  participants: [
    {
      nickname: 'some_nick',
      picture:
        'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
      id: 'auth0|12341234',
    },
  ],
  race: false,
  subtitle: 'Some subtitle',
  timeStart: {
    hours: 9,
    minutes: 30,
  },
  title: ' Title',
  type: EventType.Karonkka,
}

describe('DynamoDt65Event transform', () => {
  it('should fail to create ', async () => {
    const id = ulid()

    const returnValue = transform(creatableEvent, id)
    expect(returnValue.title).toBe('Title')
  })
})
