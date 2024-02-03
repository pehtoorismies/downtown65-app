import type { EventType } from '~/generated/graphql'
import {
  IconArmchair,
  IconBike,
  IconBottle,
  IconBrandZwift,
  IconIceSkating,
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
  CYCLING: {
    text: 'Pyöräily',
    imageUrl: '/event-images/cycling.jpg',
    icon: <IconBike size={SIZE} />,
  },
  ICE_HOCKEY: {
    text: 'Lätkä',
    imageUrl: '/event-images/hockey.jpg',
    icon: <IconIceSkating size={SIZE} />,
  },
  KARONKKA: {
    text: 'Karonkka',
    imageUrl: '/event-images/karonkka.jpg',
    icon: <IconBottle size={SIZE} />,
  },
  MEETING: {
    text: 'Kokous',
    imageUrl: '/event-images/meeting.jpg',
    icon: <IconArmchair size={SIZE} />,
  },
  NORDIC_WALKING: {
    text: 'Sauvakävely',
    imageUrl: '/event-images/nordicwalking.jpg',
    icon: <IconTrekking size={SIZE} />,
  },
  ORIENTEERING: {
    text: 'Suunnistus',
    imageUrl: '/event-images/orienteering.jpg',
    icon: <IconMap size={SIZE} />,
  },
  OTHER: {
    text: 'Muu',
    imageUrl: '/event-images/other.jpg',
    icon: <IconRecycle size={SIZE} />,
  },
  RUNNING: {
    text: 'Juoksu',
    imageUrl: '/event-images/running.jpg',
    icon: <IconRun size={SIZE} />,
  },
  SKIING: {
    text: 'Hiihto',
    imageUrl: '/event-images/skiing.jpg',
    icon: <IconSnowflake size={SIZE} />,
  },
  SPINNING: {
    text: 'Spinning',
    imageUrl: '/event-images/spinning.jpg',
    icon: <IconBrandZwift size={SIZE} />,
  },
  SWIMMING: {
    text: 'Uinti',
    imageUrl: '/event-images/swimming.jpg',
    icon: <IconSwimming size={SIZE} />,
  },
  TRACK_RUNNING: {
    text: 'Ratajuoksu',
    imageUrl: '/event-images/trackrunning.jpg',
    icon: <IconTrack size={SIZE} />,
  },
  TRAIL_RUNNING: {
    text: 'Polkujuoksu',
    imageUrl: '/event-images/trailrunning.jpg',
    icon: <IconTrees size={SIZE} />,
  },
  TRIATHLON: {
    text: 'Triathlon',
    imageUrl: '/event-images/triathlon.jpg',
    icon: <IconTriangleInverted size={SIZE} />,
  },
  ULTRAS: {
    text: 'Ultras',
    imageUrl: '/event-images/ultras.jpg',
    icon: <IconSparkles size={SIZE} />,
  },
}

export const mapToData = (
  type: EventType
): { imageUrl: string; text: string; icon: React.ReactNode } =>
  EVENT_DATA_MAP[type]
