import { EventType } from '~/gql/types.gen'

const EVENT_DATA_MAP: Record<EventType, { imageUrl: string; text: string }> = {
  [EventType.Cycling]: {
    text: 'Pyöräily',
    imageUrl: '/event-images/cycling.jpg',
  },
  [EventType.Karonkka]: {
    text: 'Karonkka',
    imageUrl: '/event-images/karonkka.jpg',
  },
  [EventType.Meeting]: {
    text: 'Kokous',
    imageUrl: '/event-images/meeting.jpg',
  },
  [EventType.NordicWalking]: {
    text: 'Sauvakävely',
    imageUrl: '/event-images/nordicwalking.jpg',
  },
  [EventType.Orienteering]: {
    text: 'Suunnistus',
    imageUrl: '/event-images/orienteering.jpg',
  },
  [EventType.Other]: {
    text: 'Muu',
    imageUrl: '/event-images/other.jpg',
  },
  [EventType.Running]: {
    text: 'Juoksu',
    imageUrl: '/event-images/running.jpg',
  },
  [EventType.Skiing]: {
    text: 'Hiihto',
    imageUrl: '/event-images/skiing.jpg',
  },
  [EventType.Spinning]: {
    text: 'Spinning',
    imageUrl: '/event-images/spinning.jpg',
  },
  [EventType.Swimming]: {
    text: 'Uinti',
    imageUrl: '/event-images/swimming.jpg',
  },
  [EventType.TrackRunning]: {
    text: 'Ratajuoksu',
    imageUrl: '/event-images/trackrunning.jpg',
  },
  [EventType.TrailRunning]: {
    text: 'Polkujuoksu',
    imageUrl: '/event-images/trailrunning.jpg',
  },
  [EventType.Triathlon]: {
    text: 'Triathlon',
    imageUrl: '/event-images/triathlon.jpg',
  },
  [EventType.Ultras]: {
    text: 'Ultras',
    imageUrl: '/event-images/ultras.jpg',
  },
}

export const mapToData = (
  type: EventType
): { imageUrl: string; text: string } => EVENT_DATA_MAP[type]
