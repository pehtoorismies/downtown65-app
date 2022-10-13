import { Button } from '@mantine/core'
import { IconHandOff, IconHandStop } from '@tabler/icons'

interface Properties {
  isParticipating: boolean
}

const InButton = () => {
  return (
    <Button
      leftIcon={<IconHandStop size={18} />}
      styles={(theme) => ({
        root: {
          backgroundColor: theme.colors.blue[9],
          border: 0,
          height: 42,
          paddingLeft: 20,
          paddingRight: 20,

          '&:hover': {
            backgroundColor: theme.fn.darken(theme.colors.blue[9], 0.05),
          },
        },

        leftIcon: {
          marginRight: 15,
        },
      })}
    >
      Osallistu
    </Button>
  )
}

const OutButton = () => {
  return (
    <Button
      leftIcon={<IconHandOff size={18} />}
      styles={(theme) => ({
        root: {
          backgroundColor: theme.colors.dtPink[9],
          border: 0,
          height: 42,
          paddingLeft: 20,
          paddingRight: 20,

          '&:hover': {
            backgroundColor: theme.fn.darken(theme.colors.dtPink[9], 0.05),
          },
        },

        leftIcon: {
          marginRight: 15,
        },
      })}
    >
      Poistu
    </Button>
  )
}

export const ToggleJoinButton = ({ isParticipating }: Properties) => {
  return isParticipating ? <OutButton /> : <InButton />
}
