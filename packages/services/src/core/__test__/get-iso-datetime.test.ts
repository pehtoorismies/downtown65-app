import { expect, test } from 'vitest'
import { getDate, getIsoDatetime, getTime } from '../get-iso-datetime'

test('Incorrect input getIsoDatetime', () => {
  expect(() => getIsoDatetime('202-12-12')).toThrowError(/Date is incorrect/)
  expect(() => getIsoDatetime('2022-13-01')).toThrowError(/Date is incorrect/)
  expect(() => getIsoDatetime('2022-12-32')).toThrowError(/Date is incorrect/)

  expect(() =>
    getIsoDatetime('2022-12-12', { hours: 24, minutes: 30 })
  ).toThrowError(/Time is incorrect/)

  expect(() =>
    getIsoDatetime('2022-12-12', { hours: -1, minutes: 30 })
  ).toThrowError(/Time is incorrect/)

  expect(() =>
    getIsoDatetime('2022-12-12', { hours: 12, minutes: 60 })
  ).toThrowError(/Time is incorrect/)

  expect(() =>
    getIsoDatetime('2022-12-12', { hours: -1, minutes: 30 })
  ).toThrowError(/Time is incorrect/)
})

test('Correct input getIsoDatetime', () => {
  expect(getIsoDatetime('2022-12-12')).toBe('2022-12-12T00:00:00')
  expect(getIsoDatetime('2022-12-12', { hours: 20, minutes: 20 })).toBe(
    '2022-12-12T20:20:00'
  )
})

test('Get date', () => {
  expect(getDate('2022-12-12')).toBe('2022-12-12')
  expect(() => getDate('202-13-12')).toThrowError(/Date is incorrect/)
  expect(getTime({ hours: 9, minutes: 30 })).toBe('09:30')
})

test('Get time', () => {
  expect(getTime()).toBeUndefined()
  expect(() => getTime({ hours: 24, minutes: 0 })).toThrowError(
    /Time is incorrect/
  )
  expect(getTime({ hours: 9, minutes: 30 })).toBe('09:30')
})
