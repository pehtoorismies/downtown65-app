import { Button } from '@mantine/core'
import { Form } from '@remix-run/react'
import { IconHandOff, IconHandStop } from '@tabler/icons'
import { Gradient } from '~/components/colors'

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
  if (isParticipating) {
    return (
      <Form method="post" action={`/events/${eventId}`}>
        <input name="action" type="hidden" value="leave" />
        <Button
          type="submit"
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
      </Form>
    )
  }

  return (
    <Form method="post" action={`/events/${eventId}`}>
      <input name="action" type="hidden" value="participate" />
      <Button
        type="submit"
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
    </Form>
  )
}
