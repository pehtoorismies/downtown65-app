import { describe, expect, test } from 'vitest'
import { DynamoDatetime } from '../dynamo-datetime'

describe('DynamoDatetime', () => {
  test.each([
    { isoDate: '202-12-12', isoTime: undefined, expected: /Date is incorrect/ },
    {
      isoDate: '2022-13-01',
      isoTime: undefined,
      expected: /Date is incorrect/,
    },
    {
      isoDate: '2022-12-32',
      isoTime: undefined,
      expected: /Date is incorrect/,
    },
    { isoDate: '2022-12-12', isoTime: '24:30', expected: /Time is incorrect/ },
    { isoDate: '2022-12-12', isoTime: 'asd', expected: /Time is incorrect/ },
    { isoDate: '2022-12-12', isoTime: '-01:20', expected: /Time is incorrect/ },
    { isoDate: '2022-12-12', isoTime: '12:60', expected: /Time is incorrect/ },
  ])(
    '({$isoDate, $isoTime}) -> $expected',
    ({ isoDate, isoTime, expected }) => {
      expect(() => DynamoDatetime.fromISO(isoDate, isoTime)).toThrowError(
        expected
      )
    }
  )

  test('Has date only', () => {
    const ddt = DynamoDatetime.fromISO('2022-12-12')
    expect(ddt.getIsoDatetime()).toBe('2022-12-12T00:00:00')
    expect(ddt.getTime()).toBeUndefined()
    expect(ddt.getISODate()).toBe('2022-12-12')
    expect(ddt.getTimeComponents()).toBeUndefined()
    expect(ddt.getDateComponents()).toEqual({ year: 2022, month: 12, day: 12 })
  })

  test('Has date and time', () => {
    const ddt = DynamoDatetime.fromISO('2022-12-12', '20:15')
    expect(ddt.getIsoDatetime()).toBe('2022-12-12T20:15:00')
    expect(ddt.getTime()).toBe('20:15')
    expect(ddt.getISODate()).toBe('2022-12-12')
    expect(ddt.getTimeComponents()).toEqual({ hours: 20, minutes: 15 })
    expect(ddt.getDateComponents()).toEqual({ year: 2022, month: 12, day: 12 })
  })

  test.each([{ isoTime: '00:00' }, { isoTime: '23:59' }, { isoTime: '09:09' }])(
    'Time: ({isoTime}) -> expected',
    ({ isoTime }) => {
      expect(DynamoDatetime.fromISO('2022-12-12', isoTime).getTime()).toBe(
        isoTime
      )
    }
  )

  test.each([
    {
      name: '0',
      dateComponents: { year: -12, month: 12, day: 12 },
      timeComponents: undefined,
      expected: /Date is incorrect/,
    },
    {
      name: '1',
      dateComponents: { year: 12, month: 12, day: 12 },
      timeComponents: undefined,
      expected: /Date is incorrect/,
    },
    {
      name: '2',
      dateComponents: { year: 2000, month: 12, day: 32 },
      timeComponents: undefined,
      expected: /Date is incorrect/,
    },
    {
      name: '3',
      dateComponents: { year: 2000, month: 13, day: 12 },
      timeComponents: undefined,
      expected: /Date is incorrect/,
    },
    {
      name: '4',
      dateComponents: { year: 2000, month: 13, day: 12 },
      timeComponents: undefined,
      expected: /Date is incorrect/,
    },
    {
      name: '5',
      dateComponents: { year: 2000, month: 12, day: 12 },
      timeComponents: {
        hours: 24,
        minutes: 0,
      },
      expected: /Time is incorrect/,
    },
    {
      name: '6',
      dateComponents: { year: 2000, month: 12, day: 12 },
      timeComponents: {
        hours: -1,
        minutes: 10,
      },
      expected: /Time is incorrect/,
    },
    {
      name: '7',
      dateComponents: { year: 2000, month: 12, day: 12 },
      timeComponents: {
        hours: 23,
        minutes: 60,
      },
      expected: /Time is incorrect/,
    },
  ])('$name -> $expected', ({ dateComponents, timeComponents, expected }) => {
    expect(() =>
      DynamoDatetime.fromComponents(dateComponents, timeComponents)
    ).toThrowError(expected)
  })

  test('Time', () => {
    const ddt = DynamoDatetime.fromISO('2022-12-12', '01:01')
    expect(ddt.getIsoDatetime()).toBe('2022-12-12T01:01:00')
    expect(ddt.getTime()).toBe('01:01')
    expect(ddt.getISODate()).toBe('2022-12-12')
    expect(ddt.getTimeComponents()).toEqual({ hours: 1, minutes: 1 })
    expect(ddt.getDateComponents()).toEqual({ year: 2022, month: 12, day: 12 })
  })

  test('DynamoDatetime format date fi', () => {
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 12,
      }).getFormattedDate()
    ).toEqual('12.12.2022 (ma)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 13,
      }).getFormattedDate()
    ).toEqual('13.12.2022 (ti)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 14,
      }).getFormattedDate()
    ).toEqual('14.12.2022 (ke)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 15,
      }).getFormattedDate()
    ).toEqual('15.12.2022 (to)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 16,
      }).getFormattedDate()
    ).toEqual('16.12.2022 (pe)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 17,
      }).getFormattedDate()
    ).toEqual('17.12.2022 (la)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2022,
        month: 12,
        day: 18,
      }).getFormattedDate()
    ).toEqual('18.12.2022 (su)')
    expect(
      DynamoDatetime.fromComponents({
        year: 2023,
        month: 4,
        day: 5,
      }).getFormattedDate()
    ).toEqual('5.4.2023 (ke)')
  })

  test('From date object', () => {
    const date = new Date('2011-01-01')
    const ddt = DynamoDatetime.fromDate(date)
    expect(ddt.getIsoDatetime()).toBe('2011-01-01T00:00:00')
    expect(ddt.getTime()).toBeUndefined()
    expect(ddt.getISODate()).toBe('2011-01-01')
    expect(ddt.getTimeComponents()).toBeUndefined()
    expect(ddt.getDateComponents()).toEqual({ year: 2011, month: 1, day: 1 })
  })
})
