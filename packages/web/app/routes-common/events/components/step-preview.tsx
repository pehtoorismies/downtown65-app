import { Divider, Text, TypographyStylesProvider } from '@mantine/core'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import React from 'react'
import type { EventState } from './event-state'
import { EventHeader } from '~/components/event-card/event-header'
import { EventInfo } from '~/components/event-card/event-info'
import { Participants } from '~/components/event-card/participants'
import { Voucher } from '~/components/voucher/voucher'
import type { User } from '~/domain/user'
import { prefixZero, suffixZero } from '~/util/pad-zeros'

interface Properties {
  state: EventState
  me: User
}

const getDate = (date: EventState['date']) => {
  if (!date) {
    return 'Missing date'
  }
  return format(date, 'd.M.yyyy (EEEEEE)', { locale: fi })
}

const getTime = ({ hours, minutes }: EventState['time']) => {
  if (hours !== undefined && minutes !== undefined) {
    return `${prefixZero(hours)}:${suffixZero(minutes)}`
  }
}

export const StepPreview = ({ state, me }: Properties) => {
  if (!state.eventType) {
    throw new Error('Illegal state, not eventType defined')
  }

  const hasDescription = !!state.description.trim()

  return (
    <Voucher>
      <EventHeader
        title={state.title}
        participants={state.participants}
        user={me}
        type={state.eventType}
        race={state.isRace}
        createdBy={me}
      />
      <Voucher.Content>
        <EventInfo
          {...state}
          participants={state.participants}
          user={me}
          dateStart={getDate(state.date)}
          timeStart={getTime(state.time)}
        />
        <Divider my="xs" label="Osallistujat" labelPosition="center" />
        <Participants participants={state.participants} me={me} />
        <Divider my="xs" label="Lisätiedot" labelPosition="center" />
        {hasDescription ? (
          <TypographyStylesProvider p={0} mt="sm">
            <div dangerouslySetInnerHTML={{ __html: state.description }} />
          </TypographyStylesProvider>
        ) : (
          <Text ta="center" p="sm" c="dimmed" fw={400}>
            ei tarkempaa tapahtuman kuvausta
          </Text>
        )}
      </Voucher.Content>
    </Voucher>
  )
}
