import { Button } from '@mantine/core'
import { IconHandOff, IconHandStop } from '@tabler/icons'
import { Gradient } from '~/components/colors'

const commonProperties = {
  border: 0,
  height: 38,
  paddingLeft: 20,
  paddingRight: 20,
}

const InButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: () => void
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
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
}

const OutButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
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

export const DisabledInButton = () => (
  <InButton onClick={() => {}} disabled={true} />
)

interface Properties {
  isParticipating: boolean
  onParticipate: () => void
  onLeave: () => void
}

export const ToggleJoinButton = ({
  isParticipating,
  onParticipate,
  onLeave,
}: Properties) => {
  return isParticipating ? (
    <OutButton onClick={onLeave} />
  ) : (
    <InButton onClick={onParticipate} disabled={false} />
  )
}
