import { expect, test } from 'vitest'
import { EmailableEvent } from '../emailable-event'

const dynamoRecord = {
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

test('DynamoDatetime: only date', () => {
  const {
    date,
    description,
    eventId,
    eventImagePath,
    location,
    subtitle,
    title,
  } = EmailableEvent.parse(dynamoRecord)
  expect(date).toBe('31.12.2022 (la)')
  expect(description).toBe('<p>description</p>')
  expect(eventId).toBe('event_id')
  expect(eventImagePath).toBe('/event-images/karonkka.jpg')
  expect(location).toBe('Espoo')
  expect(subtitle).toBe('Some subtitle')
  expect(title).toBe('Some title')
})
