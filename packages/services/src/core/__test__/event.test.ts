import { describe, it, expect } from 'vitest'
import * as Event from '../event'

const creatableEvent = {
  createdBy: {
    nickname: 'some_nick',
    picture:
      'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
    id: 'some_id',
  },
  dateStart: '2018-12-13',
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

    const updatedEvent = await Event.getById(id)
    expect(updatedEvent?.participants.length).toBe(0)

    await Event.remove(id)
  })

  it('remove should throw error if event is not found', async () => {
    await expect(Event.remove('non existing')).rejects.toThrow(
      /^Event not found$/
    )
  })
})
