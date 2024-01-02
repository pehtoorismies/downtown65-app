import { EventType } from '@downtown65-app/graphql/graphql'
import {
  IconArmchair,
  IconBike,
  IconBottle,
  IconBrandZwift,
  IconMap,
  IconRecycle,
  IconRun,
  IconSnowflake,
  IconSparkles,
  IconSwimming,
  IconTrack,
  IconTrees,
  IconTrekking,
  IconTriangleInverted,
} from '@tabler/icons-react'
import React from 'react'

const SIZE = 16

const EVENT_DATA_MAP: Record<
  EventType,
  { imageUrl: string; text: string; icon: React.ReactNode }
> = {
  [EventType.Cycling]: {
    text: 'Pyöräily',
    imageUrl: '/event-images/cycling.jpg',
    icon: <IconBike size={SIZE} />,
  },
  [EventType.Karonkka]: {
    text: 'Karonkka',
    imageUrl: '/event-images/karonkka.jpg',
    icon: <IconBottle size={SIZE} />,
  },
  [EventType.Meeting]: {
    text: 'Kokous',
    imageUrl: '/event-images/meeting.jpg',
    icon: <IconArmchair size={SIZE} />,
  },
  [EventType.NordicWalking]: {
    text: 'Sauvakävely',
    imageUrl: '/event-images/nordicwalking.jpg',
    icon: <IconTrekking size={SIZE} />,
  },
  [EventType.Orienteering]: {
    text: 'Suunnistus',
    imageUrl: '/event-images/orienteering.jpg',
    icon: <IconMap size={SIZE} />,
  },
  [EventType.Other]: {
    text: 'Muu',
    imageUrl: '/event-images/other.jpg',
    icon: <IconRecycle size={SIZE} />,
  },
  [EventType.Running]: {
    text: 'Juoksu',
    imageUrl: '/event-images/running.jpg',
    icon: <IconRun size={SIZE} />,
  },
  [EventType.Skiing]: {
    text: 'Hiihto',
    imageUrl: '/event-images/skiing.jpg',
    icon: <IconSnowflake size={SIZE} />,
  },
  [EventType.Spinning]: {
    text: 'Spinning',
    imageUrl: '/event-images/spinning.jpg',
    icon: <IconBrandZwift size={SIZE} />,
  },
  [EventType.Swimming]: {
    text: 'Uinti',
    imageUrl: '/event-images/swimming.jpg',
    icon: <IconSwimming size={SIZE} />,
  },
  [EventType.TrackRunning]: {
    text: 'Ratajuoksu',
    imageUrl: '/event-images/trackrunning.jpg',
    icon: <IconTrack size={SIZE} />,
  },
  [EventType.TrailRunning]: {
    text: 'Polkujuoksu',
    imageUrl: '/event-images/trailrunning.jpg',
    icon: <IconTrees size={SIZE} />,
  },
  [EventType.Triathlon]: {
    text: 'Triathlon',
    imageUrl: '/event-images/triathlon.jpg',
    icon: <IconTriangleInverted size={SIZE} />,
  },
  [EventType.Ultras]: {
    text: 'Ultras',
    imageUrl: '/event-images/ultras.jpg',
    icon: <IconSparkles size={SIZE} />,
  },
}

export const mapToData = (
  type: EventType
): { imageUrl: string; text: string; icon: React.ReactNode } =>
  EVENT_DATA_MAP[type]