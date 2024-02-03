import { ISODate, toISOTime } from '@downtown65-app/time'
import { EventType } from '~/generated/graphql'
import { z } from 'zod'

const isEventType = (eventType: unknown): eventType is EventType => {
  if (typeof eventType !== 'string') {
    return false
  }
  return Object.values(EventType).includes(eventType as EventType)
}

const EventForm = z.object({
  date: ISODate,
  description: z
    .string()
    .trim()
    .transform((x) => {
      return x.length === 0 ? undefined : x
    }),
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
  time: z.string().transform((x) => {
    const maybeISOTime = toISOTime(x)
    return maybeISOTime.success ? maybeISOTime.data : undefined
  }),
  title: z.string().trim().min(1),
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
