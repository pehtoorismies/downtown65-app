import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import type {
  CreateChallengeInput,
  QueryChallengesArgs,
} from '@downtown65-app/graphql/graphql'
import {
  randFutureDate,
  randIceHockeyTeam,
  randNumber,
  randPastDate,
  randSports,
  randUser,
} from '@ngneat/falso'
import { endOfMonth, startOfMonth } from 'date-fns'
import { times } from 'remeda'
import { describe, expect, test } from 'vitest'
import * as Challenge from '../challenge'

const USER_ID = 'auth0|123'
const NEXT_YEAR = new Date().getFullYear() + 1
const PICTURE_URL =
  'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png'

const createRandomChallenge = (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)

  const user = randUser()
  return {
    createdBy: {
      nickname: user.username,
      picture: user.img,
      id: `auth0|${randNumber({ min: 100_000, max: 999_999 })}`,
    },
    dateStart: DynamoDatetime.fromDate(start).getDateComponents(),
    dateEnd: DynamoDatetime.fromDate(end).getDateComponents(),
    subtitle: randIceHockeyTeam(),
    title: randSports(),
  }
}

const creatableChallenge: CreateChallengeInput = {
  createdBy: {
    nickname: 'some_nick',
    picture: PICTURE_URL,
    id: USER_ID,
  },
  dateStart: {
    year: NEXT_YEAR,
    month: 12,
    day: 1,
  },
  dateEnd: {
    year: NEXT_YEAR,
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
  test('should list challenges', async () => {
    const futureDates = times(4, () => {
      return randFutureDate()
    })
    const pastDates = times(3, () => {
      return randPastDate({ years: 2 })
    })

    const dates = [...futureDates, ...pastDates]

    const ids = []

    for (const date of dates) {
      const id = await Challenge.create(createRandomChallenge(date))
      ids.push(id)
    }

    const upcomingFilter: QueryChallengesArgs['filter'] = {
      dateEnd: {
        after: DynamoDatetime.fromDate(new Date()).getISODate(),
      },
    }
    const upcomingChallenges = await Challenge.getAll(upcomingFilter)
    expect(upcomingChallenges.length).toBe(4)

    await Challenge.removeMany([...ids])

    const noUpcoming = await Challenge.getAll(upcomingFilter)

    expect(noUpcoming.length).toBe(0)
  })

  test('should create and delete event ', async () => {
    const id = await Challenge.create(creatableChallenge)
    expect(id).toBeDefined()

    const challenge = await Challenge.getById(id)

    expectToBeDefined(challenge)
    expect(challenge.id).toBe(id)
    expect(challenge.title).toBe('Title')
    expect(challenge.subtitle).toBe('Some subtitle')
    expect(challenge.dateStart).toBe(`${NEXT_YEAR}-12-01`)
    expect(challenge.dateEnd).toBe(`${NEXT_YEAR}-12-31`)
    expect(challenge.createdBy.nickname).toBe('some_nick')
    expect(challenge.createdBy.id).toBe(USER_ID)
    expect(challenge.createdBy.picture).toBe(PICTURE_URL)

    // const result = await Challenge.createExecution(id, {})

    await Challenge.remove(id)

    expect(await Challenge.getById(id)).toBeNull()

    // await Event.participate(id, user)

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
