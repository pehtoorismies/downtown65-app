import type { MantineNumberSize } from '@mantine/core'
import { createStyles, Group, Text } from '@mantine/core'

type Participant = {
  id: string
  nickname: string
}

interface ParticipantProperties {
  participants: Participant[]
  me: Participant
}

const useStyles = createStyles((theme) => ({
  pillHighlight: {
    backgroundColor: theme.colors.dtPink,
    borderRadius: 2,
  },
  pill: {
    backgroundColor: theme.colors.blue,
    borderRadius: 2,
  },
}))

export const Participants = ({ participants, me }: ParticipantProperties) => {
  const { classes } = useStyles()

  return (
    <Group spacing={8} mr={0} mt="md">
      {participants.map((p) => {
        const isHighlighted = p.id === me.id
        const size: MantineNumberSize = 11

        const attributes = {
          color: 'white',
          px: 6,
          py: 1,
          size,
        }

        return isHighlighted ? (
          <Text key={p.id} {...attributes} className={classes.pillHighlight}>
            {p.nickname}
          </Text>
        ) : (
          <Text key={p.id} {...attributes} className={classes.pill}>
            {p.nickname}
          </Text>
        )
      })}
    </Group>
  )
}
