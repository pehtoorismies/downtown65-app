import { Button } from '@mantine/core'
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
  const actions = useParticipatingContext()
  const { user } = useUserContext()

  if (!user) {
    return (
      <Button
        component={Link}
        to="/login"
        leftSection={<IconLogin size={18} />}
        data-testid="event-goto-login"
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
        leftSection={<IconHandOff size={18} />}
        variant="gradient"
        gradient={Gradient.dtPink}
        data-testid="leave"
      >
        Poistu
      </Button>
    )
  }

  return (
    <Button
      style={{ width: 140 }}
      onClick={() => {
        actions.onParticipate(id ?? 'no-event-id')
      }}
      loading={loading}
      leftSection={<IconHandStop size={18} />}
      data-testid="participate"
    >
      Osallistu
    </Button>
  )
}
