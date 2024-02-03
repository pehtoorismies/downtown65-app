import { Center, Switch, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import type { ReducerProps } from './reducer'
import { ActiveStep } from './reducer'
import {
  NextButton,
  PreviousButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'

const spacing = 'md'

const validate = (inputTitle: string) => (value: string) => {
  return value.trim().length === 0 ? `${inputTitle} ei voi olla tyhjä` : null
}

export const StepTitle = ({ state, dispatch }: ReducerProps) => {
  const form = useForm({
    initialValues: {
      title: state.title,
      subtitle: state.subtitle,
      location: state.location,
    },
    // validateInputOnChange: true,
    validate: {
      title: validate('Nimi'),
      subtitle: validate('Tarkenne'),
      location: validate('Sijainti'),
    },
  })

  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const size = matches ? 'md' : 'lg'
  const switchSize = matches ? 'md' : 'lg'

  return (
    <StepLayout
      title="Perustiedot"
      prevButton={
        <PreviousButton
          onClick={() => {
            dispatch({
              kind: 'info',
              ...form.values,
              activeStep: ActiveStep.STEP_EVENT_TYPE,
            })
          }}
        >
          Laji
        </PreviousButton>
      }
      nextButton={
        <NextButton
          onClick={() => {
            if (!form.validate().hasErrors) {
              dispatch({
                kind: 'info',
                ...form.values,
                activeStep: ActiveStep.STEP_DATE,
              })
            }
          }}
        >
          Päivämäärä
        </NextButton>
      }
    >
      <TextInput
        name="title"
        my={spacing}
        placeholder="Jukola Konala"
        label="Tapahtuman nimi"
        size={size}
        withAsterisk
        {...form.getInputProps('title')}
      />
      <TextInput
        name="subtitle"
        my={spacing}
        placeholder="6-7 joukkuetta"
        label="Tarkenne"
        size={size}
        withAsterisk
        {...form.getInputProps('subtitle')}
      />
      <TextInput
        name="location"
        my={spacing}
        placeholder="Sijainti"
        label="Missä tapahtuma järjestetään?"
        size={size}
        withAsterisk
        {...form.getInputProps('location')}
      />
      <Center>
        <Switch
          data-testid="race-switch"
          onLabel="ON"
          offLabel="EI"
          size={switchSize}
          labelPosition="left"
          label="Onko kilpailu?"
          onChange={(event) => {
            dispatch({ kind: 'race', isRace: event.currentTarget.checked })
          }}
          checked={state.isRace}
        />
      </Center>
    </StepLayout>
  )
}
