import {
  Alert,
  Box,
  Button,
  Divider,
  Text,
  TypographyStylesProvider,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEye, IconEyeOff, IconInfoCircle } from '@tabler/icons-react'
import React from 'react'
import { ChallengeButton } from '~/components/challenge/challenge-button'
import { ChallengeRoot } from '~/components/challenge/challenge-root'
import { DoneButtons } from '~/components/challenge/done-buttons'
import { LeaderboardRow } from '~/components/challenge/leaderboard-row'
import { Participants } from '~/components/participants'
import type { User } from '~/domain/user'
import type { Challenge } from '~/generated/graphql'
import type { DoneDate } from '~/util/challenge-date'
import type { ChallengeStatus } from '~/util/challenge-tools'

interface Props {
  user: User
  challenge: Challenge
  challengeStatus: ChallengeStatus
  myDoneDates: DoneDate[]
}

export const ChallengeCard = (props: Props) => {
  const { user, challenge, challengeStatus, myDoneDates } = props
  const [opened, { toggle }] = useDisclosure()

  const descriptionText = challenge.description?.trim()

  const descriptionElement = (
    <>
      <Divider my="xs" label="Lisätiedot" labelPosition="center" />
      {!!descriptionText && (
        <TypographyStylesProvider p={0} mt="sm">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Fix later */}
          <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
        </TypographyStylesProvider>
      )}
      {!descriptionText && (
        <Text ta="center" p="sm" c="dimmed" fw={400}>
          ei tarkempaa tapahtuman kuvausta
        </Text>
      )}
    </>
  )

  switch (challengeStatus.status) {
    case 'ENDED': {
      return (
        <ChallengeRoot {...props} button={<ChallengeButton {...props} />}>
          {descriptionElement}
          <Divider my="xs" label="Leaderboard" labelPosition="center" />
        </ChallengeRoot>
      )
    }
    case 'NOT_STARTED': {
      return (
        <ChallengeRoot {...props} button={<ChallengeButton {...props} />}>
          {descriptionElement}
          <Divider my="xs" label="Osallistujat" labelPosition="center" />
          <Box mb="sm">
            <Participants participants={challenge.participants} />
          </Box>
        </ChallengeRoot>
      )
    }

    case 'RUNNING': {
      const toggleButton = opened ? (
        <Button
          m="xs"
          onClick={toggle}
          color="yellow"
          variant="outline"
          rightSection={<IconEyeOff size={18} />}
        >
          Piilota omat suoritukset
        </Button>
      ) : (
        <Button
          m="xs"
          onClick={toggle}
          variant="outline"
          rightSection={<IconEye size={18} />}
          color="yellow"
        >
          Näytä/editoi omat suoritukset
        </Button>
      )

      return (
        <ChallengeRoot {...props} button={<ChallengeButton {...props} />}>
          {descriptionElement}

          <Divider my="xs" label="Leaderboard" labelPosition="center" />
          <Box my="md">
            <LeaderboardRow
              position={1}
              participant={{ ...user, doneDatesCount: 3 }}
              daysTotal={30}
              daysDone={5}
            />
          </Box>
          {!opened && <Divider my="xs" />}
          {opened && (
            <>
              <Divider my="xs" label="Edit zone" labelPosition="center" />
              <Alert
                variant="light"
                color="blue"
                title="Ohje"
                icon={<IconInfoCircle />}
              >
                Muokkaa suorituksia klikkaamalla päivämäärää.
              </Alert>
              <DoneButtons doneDates={myDoneDates} />
            </>
          )}
          {toggleButton}
        </ChallengeRoot>
      )
    }
  }
}
