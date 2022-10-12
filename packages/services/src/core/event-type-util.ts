import { EventType } from '../../appsync'

export const getEventValues = () => Object.values(EventType)

export const isEventType = (eventType: string): eventType is EventType => {
  return getEventValues().includes(eventType as EventType)
}

const EVENT_DATA_MAP: Record<EventType, { imageUrl: string; text: string }> = {
  CYCLING: {
    text: 'Pyöräily',
    imageUrl: '/event-images/cycling.jpg',
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

export const mapToData = (type: EventType) => EVENT_DATA_MAP[type]
