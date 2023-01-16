import { describe, it, expect } from 'vitest'
import * as Event from '../event'

const creatableEvent = {
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'some_id',
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
      id: 'some_id',
    },
  ],
  race: false,
  subtitle: 'Some subtitle',
  timeStart: {
    hours: 9,
    minutes: 30,
  },
  title: 'Title',
  type: 'KARONKKA',
}

describe('Events', () => {
  it('should create and delete event ', async () => {
    const { id } = await Event.create(creatableEvent)
    const event = await Event.getById(id)
    expect(event).toBeDefined()
    expect(event?.id).toBeDefined()
    expect(event?.timeStart).toBe('09:30')
    expect(event?.participants.length).toBe(1)

    await Event.leave(id, 'some_id')
    // should allow leaving when already left
    await Event.leave(id, 'some_id')

    const updatedEvent = await Event.getById(id)
    expect(updatedEvent?.participants.length).toBe(0)

    const user = {
      id: '123',
      picture: 'picture',
      nickname: 'nickname',
    }

    await Event.participate(id, user)
    // should allow participating when already participated
    await Event.participate(id, user)

    const updatedEvent2 = await Event.getById(id)
    expect(updatedEvent2?.participants.length).toBe(1)

    await Event.update(id, {
      dateStart: {
        year: 2018,
        month: 12,
        day: 13,
      },
      location: 'Vantaa',
      race: true,
      subtitle: 'Some other subtitle',
      timeStart: {
        hours: 9,
        minutes: 30,
      },
      title: 'Updated title',
      type: 'OTHER',
    })

    const titleUpdateEvent = await Event.getById(id)
    expect(titleUpdateEvent?.title).toBe('Updated title')
    expect(titleUpdateEvent?.type).toBe('OTHER')
    expect(titleUpdateEvent?.race).toBe(true)
    expect(titleUpdateEvent?.location).toBe('Vantaa')
    expect(titleUpdateEvent?.subtitle).toBe('Some other subtitle')
  })

  it('remove should throw error if event is not found', async () => {
    await expect(Event.remove('non existing')).rejects.toThrow(
      /^Event not found$/
    )
  })
})
