import { parseISO } from 'date-fns'
import invariant from 'tiny-invariant'
import { describe, expect, test } from 'vitest'
import { ZodError } from 'zod'
import {
  ISODate,
  ISOTime,
  toDate,
  toFormattedDate,
  toISODate,
  toISODatetimeCompact,
  toISOTime,
  toTimeComponents,
} from '../time-functions'

describe('Time functions', () => {
  test.each([
    { date: '202-12-12' },
    {
      date: '2022-13-01',
    },
    {
      date: '2022-12-32',
    },
  ])('has invalid date ($date)', ({ date }) => {
    expect(() => ISODate.parse(date)).toThrowError(ZodError)
  })

  test.each([
    { time: '24:30' },
    { time: 'asd' },
    { time: '-01:20' },
    { time: '12:60' },
  ])('has invalid time ($time)', ({ time }) => {
    expect(() => ISOTime.parse(time)).toThrowError(ZodError)
  })

  test('isoDatetimeCompact', () => {
    expect(toISODatetimeCompact(ISODate.parse('2022-12-12'))).toBe(
      '2022-12-12T00:00:00',
    )

    expect(toISODatetimeCompact(parseISO('2014-02-11T11:30'))).toBe(
      '2014-02-11T11:30:00',
    )

    expect(
      toISODatetimeCompact(ISODate.parse('2022-12-12'), ISOTime.parse('20:15')),
    ).toBe('2022-12-12T20:15:00')

    expect(toISODatetimeCompact(ISODate.parse('2014-02-11'))).toBe(
      '2014-02-11T00:00:00',
    )

    expect(() => toISODatetimeCompact(new Date('Kissa'))).toThrowError(
      /Provided date object is not valid/,
    )

    expect(() =>
      toISODatetimeCompact(parseISO('2014-13-11T11:30')),
    ).toThrowError(/Provided date object is not valid/)

    expect(() =>
      toISODatetimeCompact(parseISO('2014-01-01T45:30')),
    ).toThrowError(/Provided date object is not valid/)
  })

  test('toTimeComponents', () => {
    expect(toTimeComponents(ISOTime.parse('20:15'))).toEqual({
      hours: 20,
      minutes: 15,
    })
    expect(toTimeComponents(ISOTime.parse('00:00'))).toEqual({
      hours: 0,
      minutes: 0,
    })
  })

  test.each([
    { date: toDate(ISODate.parse('2022-12-12'), ISOTime.parse('20:15')) },
    { date: new Date(2022, 11, 12, 20, 15) },
  ])('toDate from $date to Date-object', ({ date }) => {
    expect(date.getFullYear()).toBe(2022)
    expect(date.getMonth()).toBe(11)
    expect(date.getDate()).toBe(12)
    expect(date.getHours()).toBe(20)
    expect(date.getMinutes()).toBe(15)
    expect(date.getSeconds()).toBe(0)
    expect(date.getMilliseconds()).toBe(0)
  })

  test.each([
    { date: '2022-12-12', expected: '12.12.2022 (ma)' },
    { date: '2022-12-13', expected: '13.12.2022 (ti)' },
    { date: '2022-12-14', expected: '14.12.2022 (ke)' },
    { date: '2023-04-05', expected: '5.4.2023 (ke)' },
  ])('expect $date to be formatted as $expected', ({ date, expected }) => {
    expect(toFormattedDate(ISODate.parse(date))).toBe(expected)
  })

  test('from date object', () => {
    const date = parseISO('2014-02-11T11:30:30')
    const result = toISODate(date)
    invariant(result.success, 'Expected true')
    expect(result.data).toBe('2014-02-11')

    const wrongDate = parseISO('123')
    const errorResult = toISODate(wrongDate)
    invariant(!errorResult.success, 'Expected false')
    const error = errorResult.error
    expect(error.name).toBe('ZodError')
  })

  test.each([
    { time: '10:15', expected: '10:15' },
    { time: { hours: 10, minutes: 10 }, expected: '10:10' },
    { time: { hours: 0, minutes: 0 }, expected: '00:00' },
  ])('success from correct time $time to $expected', ({ time, expected }) => {
    const result = toISOTime(time)
    invariant(result.success)
    expect(result.data).toBe(expected)
  })

  test.each([
    { time: '0:15' },
    { time: { hours: 67, minutes: 10 } },
    { time: { hours: 0, minutes: -1 } },
  ])('error from incorrect time $time', ({ time }) => {
    const result = toISOTime(time)
    invariant(!result.success)
    expect(result.error.name).toBe('ZodError')
  })
})
