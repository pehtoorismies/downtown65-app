import { parse } from 'date-fns'
import { expect, test } from 'vitest'
import { challengeStatus } from '~/util/challenge-tools'

const getDate = (date: string) => {
  return parse(date, 'dd.MM.yyyy', new Date())
}

const startOfNovember = getDate('01.11.2022')
const endOfNovember = getDate('30.11.2022')

test('Challenge status', () => {
  expect(() =>
    challengeStatus(endOfNovember, startOfNovember, new Date()),
  ).toThrowError(/^End date is before start date$/)

  expect(
    challengeStatus(startOfNovember, endOfNovember, new Date(2022, 10, 3)),
  ).toMatchObject({
    status: 'RUNNING',
    description: '27 päivää jäljellä',
  })
  expect(
    challengeStatus(startOfNovember, endOfNovember, new Date(2022, 10, 29)),
  ).toMatchObject({
    status: 'RUNNING',
    description: 'päivä jäljellä',
  })

  expect(
    challengeStatus(startOfNovember, endOfNovember, new Date(2022, 9, 20)),
  ).toMatchObject({ status: 'NOT_STARTED', description: '12 päivää alkuun' })
  expect(
    challengeStatus(startOfNovember, endOfNovember, new Date(2022, 8, 20)),
  ).toMatchObject({
    status: 'NOT_STARTED',
    description: 'noin kuukausi alkuun',
  })

  expect(
    challengeStatus(startOfNovember, endOfNovember, new Date(2022, 11, 3)),
  ).toMatchObject({ status: 'ENDED', description: 'haaste on loppunut' })
})
