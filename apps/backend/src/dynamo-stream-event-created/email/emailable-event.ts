import { ISODate, toFormattedDate } from '@downtown65-app/time'
import type { EventType } from '@downtown65-app/types'
import { z } from 'zod'

const EVENT_DATA_MAP: Record<EventType, { imageUrl: string; text: string }> = {
  CYCLING: {
    text: 'Pyöräily',
    imageUrl: '/event-images/cycling.jpg',
  },
  ICE_HOCKEY: {
    text: 'Lätkä',
    imageUrl: '/event-images/hockey.jpg',
  },
  KARONKKA: {
    text: 'Karonkka',
    imageUrl: '/event-images/karonkka.jpg',
  },
  MEETING: {
    text: 'Kokous',
    imageUrl: '/event-images/meeting.jpg',
  },
  NORDIC_WALKING: {
    text: 'Sauvakävely',
    imageUrl: '/event-images/nordicwalking.jpg',
  },
  ORIENTEERING: {
    text: 'Suunnistus',
    imageUrl: '/event-images/orienteering.jpg',
  },
  OTHER: {
    text: 'Muu',
    imageUrl: '/event-images/other.jpg',
  },
  RUNNING: {
    text: 'Juoksu',
    imageUrl: '/event-images/running.jpg',
  },
  SKIING: {
    text: 'Hiihto',
    imageUrl: '/event-images/skiing.jpg',
  },
  SPINNING: {
    text: 'Spinning',
    imageUrl: '/event-images/spinning.jpg',
  },
  SWIMMING: {
    text: 'Uinti',
    imageUrl: '/event-images/swimming.jpg',
  },
  TRACK_RUNNING: {
    text: 'Ratajuoksu',
    imageUrl: '/event-images/trackrunning.jpg',
  },
  TRAIL_RUNNING: {
    text: 'Polkujuoksu',
    imageUrl: '/event-images/trailrunning.jpg',
  },
  TRIATHLON: {
    text: 'Triathlon',
    imageUrl: '/event-images/triathlon.jpg',
  },
  ULTRAS: {
    text: 'Ultras',
    imageUrl: '/event-images/ultras.jpg',
  },
}

const stringObject = z
  .object({
    S: z.string(),
  })
  .transform(({ S }) => S)

const optionalStringObject = z
  .optional(
    z.object({
      S: z.string(),
    }),
  )
  .transform((o) => o?.S)

export const EmailableEvent = z
  .object({
    dynamodb: z.object({
      NewImage: z.object({
        dateStart: stringObject,
        description: optionalStringObject,
        eventId: stringObject,
        location: stringObject,
        subtitle: stringObject,
        timeStart: optionalStringObject,
        title: stringObject,
        type: stringObject,
      }),
    }),
  })
  .transform(
    ({
      dynamodb: {
        NewImage: {
          dateStart,
          description,
          eventId,
          location,
          subtitle,
          title,
          type,
        },
      },
    }) => {
      const date = ISODate.safeParse(dateStart)
      const formattedDate = date.success
        ? toFormattedDate(date.data)
        : 'unavailable'

      return {
        date: formattedDate,
        description,
        eventId,
        eventImagePath: EVENT_DATA_MAP[type as EventType].imageUrl,
        location,
        subtitle,
        title,
      }
    },
  )

export type EmailableEvent = z.infer<typeof EmailableEvent>
