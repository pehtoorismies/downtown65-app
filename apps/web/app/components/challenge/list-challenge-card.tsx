import type { Challenge } from '~/generated/graphql'
import { Button } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import React from 'react'
import { ChallengeButton } from '~/components/challenge/challenge-button'
import { ChallengeRoot } from '~/components/challenge/challenge-root'
import type { User } from '~/domain/user'
import type { ChallengeStatus } from '~/util/challenge-tools'

interface Props {
  user: User
  challenge: Challenge
  challengeStatus: ChallengeStatus
}

export const ListChallengeCard = (props: Props) => {
  return (
    <ChallengeRoot button={<ChallengeButton {...props} />} {...props}>
      <Button
        component={Link}
        to={`/challenges/${props.challenge.id}`}
        fullWidth
        my="xs"
        color="yellow"
        size="compact-sm"
        rightSection={<IconArrowNarrowRight size={18} />}
        variant="subtle"
      >
        Näytä lisää
      </Button>
    </ChallengeRoot>
  )
}
