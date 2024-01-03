import { ISODate, ISOTime } from '@downtown65-app/core/event-time'
import { EventType } from '@downtown65-app/graphql/graphql'
import { z } from 'zod'

const isEventType = (eventType: unknown): eventType is EventType => {
  if (typeof eventType !== 'string') {
    return false
  }
  return Object.values(EventType).includes(eventType as EventType)
}

const EventForm = z.object({
  date: ISODate,
  description: z.string(),
  isRace: z.enum(['true', 'false']).transform((v) => v === 'true'),
  location: z.string(),
  participants: z.array(
    z.object({
      id: z.string(),
      nickname: z.string(),
      picture: z.string(),
    })
  ),
  subtitle: z.string(),
  time: ISOTime.optional(),
  title: z.string().min(2),
  type: z.custom(isEventType, { message: 'Not a valid event type' }),
})

type EventForm = z.infer<typeof EventForm>

export const getEventForm = (body: FormData): EventForm => {
  return EventForm.parse({
    date: body.get('date'),
    description: body.get('description'),
    isRace: body.get('isRace'),
    location: body.get('location'),
    participants: JSON.parse(String(body.get('participants'))),
    subtitle: body.get('subtitle'),
    title: body.get('title'),
    time: body.get('time'),
    type: body.get('eventType'),
  })
}
