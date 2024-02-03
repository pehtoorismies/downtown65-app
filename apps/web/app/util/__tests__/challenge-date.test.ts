import { describe, expect, test } from 'vitest'
import { getChallengeDates } from '~/util/challenge-date'

const DONE_ISO_DATES = ['2023-10-01', '2023-10-02', '2023-10-03']

describe('Challenge dates', () => {
  test('middle of month', () => {
    const dates = getChallengeDates({
      startISODate: '2023-10-01',
      endISODate: '2023-10-31',
      todayISODate: '2023-10-16',
      doneISODates: DONE_ISO_DATES,
      outputFormat: 'd.M.yyyy',
    })

    expect(dates.length).toBe(31)
    expect(dates[0].date).toBe('1.10.2023')
    expect(dates[0].status).toBe('DONE')

    expect(dates[1].date).toBe('2.10.2023')
    expect(dates[1].status).toBe('DONE')

    expect(dates[2].date).toBe('3.10.2023')
    expect(dates[2].status).toBe('DONE')

    expect(dates[3].date).toBe('4.10.2023')
    expect(dates[3].status).toBe('UNDONE')

    expect(dates[15].date).toBe('16.10.2023')
    expect(dates[15].status).toBe('UNDONE')

    expect(dates[16].date).toBe('17.10.2023')
    expect(dates[16].status).toBe('FUTURE')
  })

  test('from past challenge', () => {
    const dates = getChallengeDates({
      startISODate: '2023-10-01',
      endISODate: '2023-10-31',
      todayISODate: '2024-10-16',
      doneISODates: DONE_ISO_DATES,
      outputFormat: 'd.M.yyyy',
    })

    expect(dates.length).toBe(31)
    expect(dates[0].date).toBe('1.10.2023')
    expect(dates[0].status).toBe('DONE')

    expect(dates[1].date).toBe('2.10.2023')
    expect(dates[1].status).toBe('DONE')

    expect(dates[2].date).toBe('3.10.2023')
    expect(dates[2].status).toBe('DONE')

    expect(dates[3].date).toBe('4.10.2023')
    expect(dates[3].status).toBe('UNDONE')

    expect(dates[15].date).toBe('16.10.2023')
    expect(dates[15].status).toBe('UNDONE')

    expect(dates[16].date).toBe('17.10.2023')
    expect(dates[16].status).toBe('UNDONE')

    expect(dates[30].date).toBe('31.10.2023')
    expect(dates[30].status).toBe('UNDONE')
  })
})
