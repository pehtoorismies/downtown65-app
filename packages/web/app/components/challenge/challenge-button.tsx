import type { Challenge } from '@downtown65-app/graphql/graphql'
import { Button } from '@mantine/core'
import React from 'react'
import { ToggleJoinButton } from '~/components/event-card/toggle-join-button'
import type { User } from '~/domain/user'
import type { ChallengeStatus } from '~/util/challenge-tools'

interface Props {
  user: User
  challenge: Challenge
  challengeStatus: ChallengeStatus
}

export const ChallengeButton = ({
  challengeStatus,
  challenge,
  user,
}: Props): JSX.Element => {
  const isParticipating =
    user !== null &&
    challenge.participants.map(({ id }) => id).includes(user.id)

  switch (challengeStatus.status) {
    case 'RUNNING': {
      return isParticipating ? (
        <Button color="yellow">Merkitse tehdyksi</Button>
      ) : (
        <ToggleJoinButton isParticipating={isParticipating} id={challenge.id} />
      )
    }
    case 'ENDED': {
      return (
        <Button disabled color="red">
          Haaste loppunut
        </Button>
      )
    }
    case 'NOT_STARTED': {
      return (
        <ToggleJoinButton isParticipating={isParticipating} id={challenge.id} />
      )
    }
  }
}
