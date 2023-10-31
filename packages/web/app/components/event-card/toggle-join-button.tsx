import { Button } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconHandOff, IconHandStop, IconLogin } from '@tabler/icons-react'
import { Gradient } from '~/components/colors'
import { useParticipatingContext } from '~/contexts/participating-context'

export const GotoLoginButton = () => (
  <Button
    component={Link}
    to="/login"
    leftSection={<IconLogin size={18} />}
    data-testid="event-goto-login"
  >
    Kirjaudu
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
        style={{ width: 140 }}
        onClick={() => {
          actions.onLeave(eventId ?? 'no-event-id')
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
        actions.onParticipate(eventId ?? 'no-event-id')
      }}
      loading={loading}
      leftSection={<IconHandStop size={18} />}
      data-testid="participate"
    >
      Osallistu
    </Button>
  )
}
