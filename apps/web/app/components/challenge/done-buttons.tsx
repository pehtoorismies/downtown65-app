import { Button, Group } from '@mantine/core'
import { IconCheck, IconCircle } from '@tabler/icons-react'
import React from 'react'
import type { DoneDate } from '~/util/challenge-date'

interface Props {
  doneDates: DoneDate[]
}

const W = 165

const getButton = ({ status, date }: DoneDate): JSX.Element => {
  switch (status) {
    case 'DONE': {
      return (
        <Button
          key={date}
          style={{ width: W }}
          variant="filled"
          color="green"
          leftSection={<IconCheck size={14} />}
        >
          {date}
        </Button>
      )
    }
    case 'UNDONE': {
      return (
        <Button
          key={date}
          style={{ width: W }}
          variant="outline"
          color="red"
          leftSection={<IconCircle size={14} />}
        >
          {date}
        </Button>
      )
    }
    case 'FUTURE': {
      return (
        <Button
          key={date}
          style={{ width: W }}
          disabled
          variant="default"
          color="green"
          leftSection={<IconCircle size={14} />}
        >
          {date}
        </Button>
      )
    }
  }
}

export const DoneButtons = ({ doneDates }: Props) => {
  const buttonList = doneDates.map((doneDate) => {
    return getButton(doneDate)
  })
  return (
    <Group m="sm" gap="xs" justify="center">
      {buttonList}
    </Group>
  )
}
