import { Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Link } from '@remix-run/react'
import { IconHandOff, IconHandStop, IconLogin } from '@tabler/icons-react'
import { Gradient } from '~/components/colors'
import { useParticipatingContext } from '~/contexts/participating-context'
import { useUserContext } from '~/contexts/user-context'

interface Properties {
  isParticipating: boolean
  id?: string
}

export const ToggleJoinButton = ({ isParticipating, id }: Properties) => {
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const actions = useParticipatingContext()
  const { user } = useUserContext()

  const size = matches ? 'xs' : 'sm'
  const iconSize = matches ? 14 : 18

  if (user == null) {
    return (
      <Button
        component={Link}
        to="/login"
        leftSection={<IconLogin size={iconSize} />}
        data-testid="event-goto-login"
        size={size}
      >
        Kirjaudu
      </Button>
    )
  }

  const loading = actions.state !== 'idle' && actions.loadingId === id
  if (isParticipating) {
    return (
      <Button
        style={{ width: 140 }}
        onClick={() => {
          actions.onLeave(id ?? 'no-event-id')
        }}
        loading={loading}
        leftSection={<IconHandOff size={iconSize} />}
        variant="gradient"
        gradient={Gradient.dtPink}
        data-testid="leave"
        size={size}
      >
        Poistu
      </Button>
    )
  }

  return (
    <Button
      style={{ width: 140 }}
      size={size}
      onClick={() => {
        actions.onParticipate(id ?? 'no-event-id')
      }}
      loading={loading}
      leftSection={<IconHandStop size={iconSize} />}
      data-testid="participate"
    >
      Osallistu
    </Button>
  )
}
