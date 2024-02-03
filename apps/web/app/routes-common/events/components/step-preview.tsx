import { padTime } from '@downtown65-app/time'
import { IconDeviceFloppy, IconRocket } from '@tabler/icons-react'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import React from 'react'
import type { EventState } from './event-state'
import { Gradient } from '~/components/colors'
import { EventCard } from '~/components/event/event-card'
import type { User } from '~/domain/user'
import type { ReducerProps } from '~/routes-common/events/components/reducer'
import {
  NextButton,
  PreviousButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'

interface Properties extends ReducerProps {
  me: User
  submit: () => void
  submitState: 'idle' | 'submitting' | 'loading'
}

const getDate = (date: EventState['date']) => {
  if (!date) {
    return 'Missing date'
  }
  return format(date, 'd.M.yyyy (EEEEEE)', { locale: fi })
}

const getTime = ({ hours, minutes }: EventState['time']) => {
  if (hours !== undefined && minutes !== undefined) {
    return `${padTime(hours)}:${padTime(minutes)}`
  }
}

const getButtonProps = (
  kind: EventState['kind']
): { text: string; icon: React.ReactNode } => {
  switch (kind) {
    case 'create': {
      return { text: 'Luo tapahtuma', icon: <IconRocket size={18} /> }
    }
    case 'edit': {
      return { text: 'Tallenna', icon: <IconDeviceFloppy size={18} /> }
    }
  }
}

export const StepPreview = ({
  state,
  me,
  dispatch,
  submit,
  submitState,
}: Properties) => {
  if (!state.eventType) {
    throw new Error('Illegal state, not eventType defined')
  }

  const previousButton = (
    <PreviousButton onClick={() => dispatch({ kind: 'previousStep' })}>
      Kuvaus
    </PreviousButton>
  )

  const { text, icon } = getButtonProps(state.kind)

  const nextButton = (
    <NextButton
      onClick={submit}
      rightSection={icon}
      gradient={Gradient.dtPink}
      variant="gradient"
      loading={submitState !== 'idle'}
    >
      {text}
    </NextButton>
  )

  return (
    <StepLayout
      title="Esikatselu"
      prevButton={previousButton}
      nextButton={nextButton}
    >
      <EventCard
        title={state.title}
        race={state.isRace}
        subtitle={state.subtitle}
        location={state.location}
        type={state.eventType}
        createdBy={me}
        participants={state.participants}
        dateStart={getDate(state.date)}
        timeStart={getTime(state.time)}
        description={state.description}
      />
    </StepLayout>
  )
}
