import { Button } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconHandOff, IconHandStop, IconLogin } from '@tabler/icons-react'
import { Gradient } from '~/components/colors'
import { useParticipatingContext } from '~/contexts/participating-context'
import type { User } from '~/domain/user'

interface Properties {
  isParticipating: boolean
  id?: string
  user: User | null
}

export const ToggleJoinButton = ({ isParticipating, id, user }: Properties) => {
  const actions = useParticipatingContext()

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
