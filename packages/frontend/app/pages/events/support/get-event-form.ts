import { z } from 'zod'
import { EventType } from '~/gql/types.gen'

const isEventType = (eventType: unknown): eventType is EventType => {
  if (typeof eventType !== 'string') {
    return false
  }
  return Object.values(EventType).includes(eventType as EventType)
}

const preprocessNumber = (a: unknown) => {
  return typeof a === 'string' ? Number.parseInt(a, 10) : undefined
}

const DateObject = z.object({
  year: z.preprocess(preprocessNumber, z.number().positive().gte(2000)),
  month: z.preprocess(preprocessNumber, z.number().positive().lte(12)),
  day: z.preprocess(preprocessNumber, z.number().positive().lte(31)),
})

const EventForm = z.object({
  date: DateObject,
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
  time: z
    .object({
      minutes: z.preprocess(
        preprocessNumber,
        z.union([z.undefined(), z.number().nonnegative().lt(60)])
      ),
      hours: z.preprocess(
        preprocessNumber,
        z.union([z.undefined(), z.number().nonnegative().lt(24)])
      ),
    })
    .transform(({ minutes, hours }) => {
      if (minutes !== undefined && hours !== undefined) {
        return { minutes, hours }
      }
    })
    .optional(),
  title: z.string().min(2),
  type: z.custom(isEventType, { message: 'Not a valid phone number' }),
})

type EventForm = z.infer<typeof EventForm>

export const getEventForm = (body: FormData): EventForm => {
  return EventForm.parse({
    date: {
      year: body.get('year'),
      month: body.get('month'),
      day: body.get('day'),
    },
    description: body.get('description'),
    isRace: body.get('isRace'),
    location: body.get('location'),
    participants: JSON.parse(String(body.get('participants'))),
    subtitle: body.get('subtitle'),
    title: body.get('title'),
    time: {
      minutes: body.get('minutes'),
      hours: body.get('hours'),
    },
    type: body.get('eventType'),
  })
}
