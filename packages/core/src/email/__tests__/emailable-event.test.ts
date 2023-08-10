import { describe, expect, it } from 'vitest'
import { EmailableEvent } from '../emailable-event'

const dynamoRecord1 = {
  dynamodb: {
    NewImage: {
      eventId: { S: 'event_id' },
      race: { BOOL: true },
      description: { S: '<p>description</p>' },
      title: { S: 'Some title' },
      type: { S: 'KARONKKA' },
      timeStart: { S: '23:50' },
      createdBy: {
        M: {
          nickname: { S: 'testixix' },
          id: { S: 'auth0|5d9ae9cef5515f0e30d9b42a' },
          picture: {
            S: 'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
          },
        },
      },
      dateStart: { S: '2022-12-31' },
      subtitle: { S: 'Some subtitle' },
      location: { S: 'Espoo' },
    },
  },
}

const dynamoRecord2 = {
  dynamodb: {
    NewImage: {
      eventId: { S: 'event_id' },
      race: { BOOL: true },
      title: { S: 'Some title' },
      type: { S: 'KARONKKA' },
      timeStart: { S: '23:50' },
      createdBy: {
        M: {
          nickname: { S: 'testixix' },
          id: { S: 'auth0|5d9ae9cef5515f0e30d9b42a' },
          picture: {
            S: 'https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
          },
        },
      },
      dateStart: { S: '2022-12-31' },
      subtitle: { S: 'Some subtitle' },
      location: { S: 'Espoo' },
    },
  },
}

describe('EmailableEvent parse', () => {
  it('when no time given', async () => {
    const {
      date,
      description,
      eventId,
      eventImagePath,
      location,
      subtitle,
      title,
    } = EmailableEvent.parse(dynamoRecord1)
    expect(date).toBe('31.12.2022 (la)')
    expect(description).toBe('<p>description</p>')
    expect(eventId).toBe('event_id')
    expect(eventImagePath).toBe('/event-images/karonkka.jpg')
    expect(location).toBe('Espoo')
    expect(subtitle).toBe('Some subtitle')
    expect(title).toBe('Some title')
  })

  it('when no description given', async () => {
    const {
      date,
      description,
      eventId,
      eventImagePath,
      location,
      subtitle,
      title,
    } = EmailableEvent.parse(dynamoRecord2)
    expect(date).toBe('31.12.2022 (la)')
    expect(description).toBeUndefined()
    expect(eventId).toBe('event_id')
    expect(eventImagePath).toBe('/event-images/karonkka.jpg')
    expect(location).toBe('Espoo')
    expect(subtitle).toBe('Some subtitle')
    expect(title).toBe('Some title')
  })
})
