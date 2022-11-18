import { Button } from '@mantine/core'
import { IconHandOff, IconHandStop } from '@tabler/icons'
import { Gradient } from '~/components/colors'
import { useParticipatingContext } from '~/contexts/participating-context'

const commonProperties = {
  border: 0,
  height: 38,
  paddingLeft: 20,
  paddingRight: 20,
}

export const DisabledInButton = () => (
  <Button
    disabled
    variant="gradient"
    leftIcon={<IconHandStop size={18} />}
    styles={() => ({
      root: {
        ...commonProperties,
      },
      leftIcon: {
        marginRight: 15,
      },
    })}
  >
    Osallistu
  </Button>
)

interface Properties {
  isParticipating: boolean
  eventId?: string
}

export const ToggleJoinButton = ({ isParticipating, eventId }: Properties) => {
  const actions = useParticipatingContext()
  const loading = actions.state !== 'idle' && actions.loadingEventId === eventId
  if (isParticipating) {
    return (
      <Button
        sx={{ width: 140 }}
        onClick={() => {
          actions.onLeave(eventId ?? 'no-event-id')
        }}
        loading={loading}
        leftIcon={<IconHandOff size={18} />}
        variant="gradient"
        gradient={Gradient.dtPink}
        styles={() => ({
          root: {
            ...commonProperties,
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

  return (
    <Button
      sx={{ width: 140 }}
      onClick={() => {
        actions.onParticipate(eventId ?? 'no-event-id')
      }}
      loading={loading}
      leftIcon={<IconHandStop size={18} />}
      styles={() => ({
        root: {
          ...commonProperties,
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
