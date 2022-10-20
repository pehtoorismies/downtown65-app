import { Button } from '@mantine/core'
import { IconHandOff, IconHandStop } from '@tabler/icons'
import { Gradient } from '~/components/colors'

const commonProperties = {
  border: 0,
  height: 38,
  paddingLeft: 20,
  paddingRight: 20,
}

const InButton = () => {
  return (
    <Button
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

const OutButton = () => {
  return (
    <Button
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

interface Properties {
  isParticipating: boolean
  onParticipate: () => void
  onLeave: () => void
}

export const ToggleJoinButton = ({ isParticipating }: Properties) => {
  return isParticipating ? <OutButton /> : <InButton />
}
