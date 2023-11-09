import type { CreateChallengeInput } from '@downtown65-app/graphql/graphql'
import { describe, expect, it } from 'vitest'
import * as Challenge from '../challenge'

const userId = 'auth0|123'

const creatableChallenge: CreateChallengeInput = {
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: userId,
  },
  dateStart: {
    year: 2025,
    month: 12,
    day: 1,
  },
  dateEnd: {
    year: 2025,
    month: 12,
    day: 31,
  },
  subtitle: 'Some subtitle',
  title: 'Title   ',
}

function expectToBeDefined<T>(value?: T): asserts value is NonNullable<T> {
  expect(value).toBeDefined()
}

describe('Events', () => {
  it('should create and delete event ', async () => {
    const id = await Challenge.create(creatableChallenge)
    expect(id).toBeDefined()

    const challenge = await Challenge.getById(id)

    expectToBeDefined(challenge)
    expect(challenge.id).toBe(id)
    expect(challenge.title).toBe('Title')
    expect(challenge.subtitle).toBe('Some subtitle')
    expect(challenge.dateStart).toBe('2025-12-01')
    expect(challenge.dateEnd).toBe('2025-12-31')
    expect(challenge.createdBy.nickname).toBe('some_nick')
    expect(challenge.createdBy.id).toBe(userId)
    expect(challenge.createdBy.picture).toBe(
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png'
    )

    //   await Event.leave(id, userId)
    //   // should allow leaving when already left
    //   await Event.leave(id, userId)
    //
    //   const updatedEvent = await Event.getById(id)
    //   expect(updatedEvent?.participants.length).toBe(0)
    //
    //   const user = {
    //     id: 'auth0|123',
    //     picture: 'https://server.com/picture.gif',
    //     nickname: 'nickname',
    //   }
    //
    //   await Event.participate(id, user)
    //   // should allow participating when already participated
    //   await Event.participate(id, user)
    //
    //   const updatedEvent2 = await Event.getById(id)
    //   expect(updatedEvent2?.participants.length).toBe(1)
    //
    //   await Event.update(id, {
    //     dateStart: {
    //       year: 2018,
    //       month: 12,
    //       day: 13,
    //     },
    //     location: 'Vantaa',
    //     race: true,
    //     subtitle: 'Some other subtitle',
    //     timeStart: {
    //       hours: 9,
    //       minutes: 30,
    //     },
    //     title: 'Updated title',
    //     type: EventType.Other,
    //   })
    //
    //   const titleUpdateEvent = await Event.getById(id)
    //   expect(titleUpdateEvent?.title).toBe('Updated title')
    //   expect(titleUpdateEvent?.type).toBe('OTHER')
    //   expect(titleUpdateEvent?.race).toBe(true)
    //   expect(titleUpdateEvent?.location).toBe('Vantaa')
    //   expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
  })
  //
  // it('remove should throw error if event is not found', async () => {
  //   await expect(Event.remove('non existing')).rejects.toThrow(
  //     /^Event not found$/
  //   )
  // })
})
