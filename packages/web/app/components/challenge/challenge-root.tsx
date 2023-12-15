import type { Challenge } from '@downtown65-app/graphql/graphql'
import { Box, Group, Text } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Voucher } from '~/components/voucher/voucher'
import { useParticipantsCount } from '~/hooks/use-participants-count'
import type { ChallengeStatus } from '~/util/challenge-tools'
import { formatISORunningTime } from '~/util/challenge-tools'

export interface RootProps {
  challenge: Challenge
  challengeStatus: ChallengeStatus
  button: JSX.Element
}

export const ChallengeRoot = ({
  children,
  challenge,
  button,
  challengeStatus,
}: PropsWithChildren<RootProps>) => {
  const { meAttending, count } = useParticipantsCount(challenge.participants)

  return (
    <Voucher>
      <Voucher.Header bgImageUrl={'/event-images/nordicwalking.jpg'}>
        <Voucher.Header.Title>{challenge.title}</Voucher.Header.Title>
        <Voucher.Header.ParticipantCount
          count={count}
          highlighted={meAttending}
        />
        <Voucher.Header.Creator nick={challenge.createdBy.nickname} />
      </Voucher.Header>
      <Voucher.Content>
        <Group justify="space-between">
          <Box>
            <Text fw={700} mt={2}>
              Kuukausihaaste
            </Text>
            <Text size="sm" fw={500}>
              {challenge.subtitle}
            </Text>
            <Text size="sm" c="dimmed" fw={400}>
              {formatISORunningTime(challenge)}
            </Text>
            <Text size="sm" fw={500}>
              {challengeStatus.description}
            </Text>
          </Box>
          <Group>{button}</Group>
        </Group>
        {children}
      </Voucher.Content>
    </Voucher>
  )
}
