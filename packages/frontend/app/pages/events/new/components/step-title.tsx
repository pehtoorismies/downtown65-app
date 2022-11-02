import { Center, TextInput, Switch } from '@mantine/core'
import type { ChangeEvent } from 'react'
import type { EventType } from '~/gql/types.gen'

interface Properties {
  eventType?: EventType
  onSetTitle: (title: string) => void
  title?: string
  onSetLocation: (location: string) => void
  location?: string
  isRace: boolean
  onSetRace: (isRace: boolean) => void
}

export const StepTitle = ({
  onSetTitle,
  onSetLocation,
  location,
  title,
  isRace,
  onSetRace,
}: Properties) => {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSetTitle(event.target.value)
  }
  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSetLocation(event.target.value)
  }

  return (
    <>
      <TextInput
        placeholder="Jukola Konala"
        label="Tapahtuman nimi"
        size="lg"
        withAsterisk
        onChange={handleTitleChange}
        value={title}
      />
      <TextInput
        placeholder="Sijainti"
        label="Missä tapahtuma järjestetään?"
        size="lg"
        withAsterisk
        onChange={handleLocationChange}
        value={location}
      />
      <Center>
        <Switch
          onLabel="ON"
          offLabel="EI"
          size="xl"
          labelPosition="left"
          label="Onko kilpailu?"
          onChange={(event) => onSetRace(event.currentTarget.checked)}
          checked={isRace}
        />
      </Center>
    </>
  )
}
