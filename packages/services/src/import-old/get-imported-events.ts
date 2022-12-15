import { ulid } from 'ulid'
import { getUserById } from './users'
import type { CreateEventInput } from '~/appsync.gen'

const parseMongoString = (s: string | undefined) => {
  if (s) {
    return s
  }
}

export type FormattedEvent = CreateEventInput & { id: string }

const formatType = (type: string): string => {
  const t = type.toUpperCase()
  if (t === 'TRACKRUNNING') {
    return 'TRACK_RUNNING'
  }
  if (t === 'TRAILRUNNING') {
    return 'TRAIL_RUNNING'
  }
  if (t === 'NORDICWALKING') {
    return 'NORDIC_WALKING'
  }
  return t
}

const formatMongoEvent = (mongoEvent: any): FormattedEvent => {
  // console.log(mongoEvent['_id']['$oid'])
  const createdAt = mongoEvent['createdAt']['$date']['numberLong']
  const id = ulid(createdAt)
  const timestamp = mongoEvent.date['$date']['$numberLong']
  const date = new Date(Number(timestamp))

  return {
    id,
    race: mongoEvent.race,
    type: formatType(mongoEvent.type),
    title: mongoEvent.title,
    description: parseMongoString(mongoEvent.description),
    createdBy: {
      id: mongoEvent.creator.sub,
      nickname: mongoEvent.creator.nickname,
      picture: getUserById(mongoEvent.creator.sub)?.picture ?? 'NOT_FOUND',
    },
    dateStart: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
    timeStart: mongoEvent.exactTime
      ? {
          hours: date.getHours() + 2, // hack to GTM to +2
          minutes: date.getMinutes(),
        }
      : undefined, // fi time?
    participants: mongoEvent.participants.map(
      (p: { sub: string; nickname: string }) => {
        return {
          id: p.sub,
          nickname: p.nickname,
          picture: getUserById(p.sub)?.picture ?? 'NOT_FOUND',
        }
      }
    ),
    subtitle: parseMongoString(mongoEvent.subtitle) ?? 'ei tarkennetta',
    location: parseMongoString(mongoEvent.subtitle) ?? 'ei sijaintia',
  }
}

export const getImportedEvents = (
  oldEvensSemiJSON: string,
  start: number,
  end: number
): FormattedEvent[] => {
  const parts = oldEvensSemiJSON.split(/\r?\n/).slice(1, -1)
  const objects = []

  for (const line of parts) {
    const object = JSON.parse(line)
    objects.push(object)
  }

  // @ts-ignore
  return objects
    .map((oldEvent) => formatMongoEvent(oldEvent))
    .slice(start - 1, end)
}
