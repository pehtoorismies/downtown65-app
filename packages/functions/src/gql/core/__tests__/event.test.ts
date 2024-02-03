import { EventType } from '@downtown65-app/graphql/graphql'
import { ISODate, ISOTime } from '@downtown65-app/time'
import { describe, expect, test } from 'vitest'
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
  description: '<p>some thing</p>',
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

describe('Events', () => {
  test('should create and delete event ', async () => {
    const id = await Event.create(creatableEvent)
    const event = await Event.getById(id)
    expect(event).toBeDefined()
    expect(event?.id).toBeDefined()
    expect(event?.timeStart).toBe('09:30')
    expect(event?.description).toBe('<p>some thing</p>')
    expect(event?.participants.length).toBe(1)

    await Event.leave(id, userId)
    // should allow leaving when already left
    await Event.leave(id, userId)

    const updatedEvent = await Event.getById(id)
    expect(updatedEvent?.participants.length).toBe(0)

    const user = {
      id: 'auth0|123',
      picture: 'https://server.com/picture.gif',
      nickname: 'nickname',
    }

    await Event.participate(id, user)
    // should allow participating when already participated
    await Event.participate(id, user)

    const updatedEvent2 = await Event.getById(id)
    expect(updatedEvent2?.participants.length).toBe(1)

    // description missing should be removed
    await Event.update(id, {
      dateStart: ISODate.parse('2018-12-13'),
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: ISOTime.parse('12:45'),
      description: undefined, // remove description
      title: 'Updated title',
      type: EventType.Other,
    })

    const titleUpdateEvent = await Event.getById(id)
    expect(titleUpdateEvent?.title).toBe('Updated title')
    expect(titleUpdateEvent?.type).toBe('OTHER')
    expect(titleUpdateEvent?.race).toBe(true)
    expect(titleUpdateEvent?.location).toBe('Vantaa')
    expect(titleUpdateEvent?.timeStart).toBe('12:45')
    expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
    expect(titleUpdateEvent?.description).toBeUndefined()

    await Event.update(id, {
      dateStart: ISODate.parse('2018-12-13'),
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: undefined,
      title: 'Updated title',
      type: EventType.Other,
    })

    const timeRemoved = await Event.getById(id)
    expect(timeRemoved?.timeStart).toBeUndefined()
    expect(timeRemoved?.description).toBeUndefined()

    await Event.remove(id)
  })

  test('remove should throw error if event is not found', async () => {
    await expect(Event.remove('non existing')).rejects.toThrow(
      /^Event not found$/
    )
  })
})
