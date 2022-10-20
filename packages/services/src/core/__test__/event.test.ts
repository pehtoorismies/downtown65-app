import { describe, it, expect } from 'vitest'
import * as Event from '../event'

describe('Events', () => {
  it('should create, update and delete event ', async () => {
    const { id } = await Event.create({
      title: 'Title',
      race: false,
      dateStart: '2018-06-13T12:11:13',
      location: 'Sipoo',
      type: 'KARONKKA',
      participants: [
        {
          nickname: 'some_nick',
          picture:
            'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
          id: 'some_id',
        },
      ],
      createdBy: {
        nickname: 'some_nick',
        picture:
          'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
        id: 'some_id',
      },
    })

    const event = await Event.getById(id)
    expect(event).toBeDefined()
    expect(event?.id).toBeDefined()
    expect(event?.participants.length).toBe(1)

    await Event.remove(id)
  })

  it('remove should throw error if event is not found', async () => {
    await expect(Event.remove('non existing')).rejects.toThrow(
      /^Event not found$/
    )
  })
})
