import { ISODate, ISOTime } from '@downtown65-app/time'
import { EventType, type Event as Evt } from '@downtown65-app/types'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import * as Event from '../event'

const userId = 'auth0|123'

const creatableEvent = {
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: userId,
  },
  dateStart: ISODate.parse('2018-12-13'),
  description: '<p>something</p>',
  location: 'Sipoo',
  participants: [
    {
      nickname: 'some_nick',
      picture:
        'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
      id: userId,
    },
  ],
  race: false,
  subtitle: 'Some subtitle',
  timeStart: ISOTime.parse('09:30'),
  title: 'Title   ',
  type: EventType.Karonkka,
}

const verifyEvent = (event: Evt | null) => {
  expect(event).toBeDefined()
  expect(event?.id).toBeDefined()
  expect(event?.timeStart).toBe('09:30')
  expect(event?.description).toBe('<p>something</p>')
  expect(event?.participants.length).toBe(1)
}

let testEventId: string

describe('Event', () => {
  beforeEach(async () => {
    testEventId = await Event.create(creatableEvent)
  })

  afterEach(async () => {
    await Event.remove(testEventId)
  })

  test('should have values', async () => {
    const event = await Event.getById(testEventId)
    verifyEvent(event)
  })

  test('should not cause error leaving twice', async () => {
    await Event.leave(testEventId, userId)
    // should allow leaving when already left
    await Event.leave(testEventId, userId)
  })

  test('should be able to leave event', async () => {
    await Event.leave(testEventId, userId)

    const updatedEvent = await Event.getById(testEventId)
    expect(updatedEvent?.participants.length).toBe(0)

    // should allow leaving when already left
    await Event.leave(testEventId, userId)
  })

  test('should be able to participate event', async () => {
    const user = {
      id: 'auth0|123',
      picture: 'https://server.com/picture.gif',
      nickname: 'nickname',
    }

    await Event.participate(testEventId, user)
    const joinedEvent = await Event.getById(testEventId)
    expect(joinedEvent?.participants.length).toBe(1)

    // should allow participating when already participated
    await Event.participate(testEventId, user)
    const again = await Event.getById(testEventId)
    expect(again?.participants.length).toBe(1)
  })

  test('should be update fields and remove description', async () => {
    // description missing should be removed
    await Event.update(testEventId, {
      dateStart: ISODate.parse('2018-12-13'),
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: ISOTime.parse('12:45'),
      description: undefined, // remove description
      title: 'Updated title',
      type: EventType.Other,
    })

    const titleUpdateEvent = await Event.getById(testEventId)
    expect(titleUpdateEvent?.title).toBe('Updated title')
    expect(titleUpdateEvent?.type).toBe('OTHER')
    expect(titleUpdateEvent?.race).toBe(true)
    expect(titleUpdateEvent?.location).toBe('Vantaa')
    expect(titleUpdateEvent?.timeStart).toBe('12:45')
    expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
    expect(titleUpdateEvent?.description).toBeUndefined()
  })

  test('should be update fields and remove timeStart', async () => {
    // description missing should be removed
    await Event.update(testEventId, {
      dateStart: ISODate.parse('2018-12-13'),
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: undefined,
      description: 'Koira', // remove description
      title: 'Updated title',
      type: EventType.Other,
    })

    const titleUpdateEvent = await Event.getById(testEventId)
    expect(titleUpdateEvent?.title).toBe('Updated title')
    expect(titleUpdateEvent?.type).toBe('OTHER')
    expect(titleUpdateEvent?.race).toBe(true)
    expect(titleUpdateEvent?.location).toBe('Vantaa')
    expect(titleUpdateEvent?.timeStart).toBeUndefined()
    expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
    expect(titleUpdateEvent?.description).toBe('Koira')
  })

  test('should be update fields and remove timeStart/description', async () => {
    // description missing should be removed
    await Event.update(testEventId, {
      dateStart: ISODate.parse('2018-12-13'),
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: undefined,
      description: undefined, // remove description
      title: 'Updated title',
      type: EventType.Other,
    })

    const titleUpdateEvent = await Event.getById(testEventId)
    expect(titleUpdateEvent?.title).toBe('Updated title')
    expect(titleUpdateEvent?.type).toBe('OTHER')
    expect(titleUpdateEvent?.race).toBe(true)
    expect(titleUpdateEvent?.location).toBe('Vantaa')
    expect(titleUpdateEvent?.timeStart).toBeUndefined()
    expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
    expect(titleUpdateEvent?.timeStart).toBeUndefined()
  })

  test('remove should throw error if event is not found', async () => {
    await expect(Event.remove('non existing')).rejects.toThrow(
      /^Event not found$/,
    )
  })
})
