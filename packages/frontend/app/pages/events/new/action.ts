import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import { z } from 'zod'
import { getGqlSdk } from '~/gql/get-gql-client'
import { EventType } from '~/gql/types.gen'
import { validateSessionUser } from '~/session.server'

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
  month: z.preprocess(preprocessNumber, z.number().nonnegative().lte(11)),
  date: z.preprocess(preprocessNumber, z.number().positive().lte(31)),
})

type DateObject = z.infer<typeof DateObject>

const EventForm = z.object({
  title: z.string().min(2),
  type: z.custom(isEventType, { message: 'Not a valid phone number' }),
  location: z.string(),
  isRace: z.enum(['true', 'false']).transform((v) => v === 'true'),
  date: DateObject,
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
  description: z.string(),
  participants: z.array(
    z.object({
      id: z.string(),
      nickname: z.string(),
      picture: z.string(),
    })
  ),
})

type EventForm = z.infer<typeof EventForm>

const getEventForm = (body: FormData): EventForm => {
  return EventForm.parse({
    title: body.get('title'),
    type: body.get('eventType'),
    location: body.get('location'),
    isRace: body.get('isRace'),
    date: {
      year: body.get('year'),
      month: body.get('month'),
      date: body.get('date'),
    },
    time: {
      minutes: body.get('minutes'),
      hours: body.get('hours'),
    },
    description: body.get('description'),
    participants: JSON.parse(String(body.get('participants'))),
  })
}

const getDateStart = (
  date: DateObject,
  time?: { hours: number; minutes: number }
): string => {
  if (!time) {
    // AWSDate
    return format(new Date(date.year, date.month, date.date), 'yyyy-MM-dd')
  }
  // AWSDateTime
  return formatISO(
    new Date(date.year, date.month, date.date, time.hours, time.minutes)
  )
}

export const action: ActionFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
  }

  const body = await request.formData()

  const {
    description,
    location,
    isRace,
    title,
    type,
    time,
    date,
    participants,
  } = getEventForm(body)

  const { createEvent } = await getGqlSdk().CreateEvent(
    {
      input: {
        createdBy: result.user,
        description: description.trim() === '' ? undefined : description,
        location,
        race: isRace,
        title,
        type,
        dateStart: getDateStart(date, time),
        participants,
      },
    },
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  return redirect(`/events/${createEvent.id}`)
}
