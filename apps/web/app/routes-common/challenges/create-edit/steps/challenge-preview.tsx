import {
  Box,
  Center,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
} from '@mantine/core'
import React from 'react'
import { Voucher } from '~/components/voucher/voucher'
import type { ChallengeReducerProps } from '~/routes-common/challenges/create-edit/challenge-reducer'
import {
  formatRunningTimeFromMonth,
  getChallengeStatusFromMonth,
} from '~/util/challenge-tools'

export const ChallengePreview = ({ state }: ChallengeReducerProps) => {
  const dateRange = formatRunningTimeFromMonth(state.date)
  const challengeStatus = getChallengeStatusFromMonth(state.date, new Date())

  const hasDescription = !!state.description.trim()

  return (
    <Voucher>
      <Voucher.Header bgImageUrl={'/event-images/nordicwalking.jpg'}>
        <Voucher.Header.Title>{state.title}</Voucher.Header.Title>
        <Voucher.Header.Creator nick="koira" />
      </Voucher.Header>
      <Voucher.Content>
        <Group justify="space-between">
          <Box>
            <Text fw={700} mt={2}>
              {state.title}
            </Text>
            <Text size="sm" fw={500}>
              {state.subtitle}
            </Text>
            <Text size="sm" c="dimmed" fw={400}>
              {dateRange}
            </Text>
            <Text size="sm" fw={500}>
              {challengeStatus.description}
            </Text>
          </Box>
        </Group>
        <Paper bg="#FAFAF8" my="sm">
          {hasDescription ? (
            <TypographyStylesProvider p="xs" m={0}>
              <div dangerouslySetInnerHTML={{ __html: state.description }} />
            </TypographyStylesProvider>
          ) : (
            <Center>
              <Text py="xl" fs="italic">
                -- Ei tarkempaa kuvausta --
              </Text>
            </Center>
          )}
        </Paper>
      </Voucher.Content>
    </Voucher>
  )
}
