import {
  randCity,
  randFutureDate,
  randNumber,
  randParagraph,
  randProductName,
  randSports,
} from '@ngneat/falso'
import type { EventInfo } from './event-info'
import { EventType } from '~/generated/graphql'

const shuffleArray = <T>(array: T[]) => {
  const clonedArray = [...array]

  for (let index = clonedArray.length - 1; index > 0; index--) {
    const index_ = Math.floor(Math.random() * (index + 1))
    const temporary = clonedArray[index]
    clonedArray[index] = clonedArray[index_]
    clonedArray[index_] = temporary
  }
  return clonedArray
}

const shuffled = shuffleArray(Object.values(EventType))

const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

export const getRandomEventTypes = (): EventType[] => {
  return shuffleArray(Object.values(EventType))
}

export const getRandomEventType = () => {
  const eventTypes = Object.values(EventType)
  return eventTypes[randNumber({ min: 0, max: eventTypes.length - 1 })]
}

export const getRandomEventInfo = (
  overrides?: Partial<EventInfo>
): EventInfo => {
  const time =
    overrides?.time === undefined
      ? {
          hours: randNumber({ min: 0, max: 23 }),
          minutes: minutes[randNumber({ min: 0, max: minutes.length - 1 })],
        }
      : overrides.time

  return {
    title: overrides?.title ?? randSports(),
    subtitle: overrides?.subtitle ?? randProductName(),
    location: overrides?.location ?? randCity(),
    type: overrides?.type ?? shuffled[0],
    time,
    date: overrides?.date ?? randFutureDate({ years: 3 }),
    description: overrides?.description ?? randParagraph(),
  }
}
