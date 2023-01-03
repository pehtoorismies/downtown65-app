import { expect, test } from 'vitest'
import { DynamoDatetime } from '../dynamo-datetime'

test.each([
  { date: '202-12-12', time: undefined, expected: /Date is incorrect/ },
  { date: '2022-13-01', time: undefined, expected: /Date is incorrect/ },
  { date: '2022-12-32', time: undefined, expected: /Date is incorrect/ },
  { date: '2022-12-12', time: '24:30', expected: /Time is incorrect/ },
  { date: '2022-12-12', time: 'asd', expected: /Time is incorrect/ },
  { date: '2022-12-12', time: '-01:20', expected: /Time is incorrect/ },
  { date: '2022-12-12', time: '12:60', expected: /Time is incorrect/ },
])(
  'DynamoDateTime({$date, $time}) -> $expected',
  ({ date, time, expected }) => {
    expect(() => new DynamoDatetime({ date, time })).toThrowError(expected)
  }
)

test.each([
  {
    name: '0',
    dates: { year: -12, month: 12, day: 12 },
    times: undefined,
    expected: /Date is incorrect/,
  },
  {
    name: '1',
    dates: { year: 12, month: 12, day: 12 },
    times: undefined,
    expected: /Date is incorrect/,
  },
  {
    name: '2',
    dates: { year: 2000, month: 12, day: 32 },
    times: undefined,
    expected: /Date is incorrect/,
  },
  {
    name: '3',
    dates: { year: 2000, month: 13, day: 12 },
    times: undefined,
    expected: /Date is incorrect/,
  },
  {
    name: '4',
    dates: { year: 2000, month: 13, day: 12 },
    times: undefined,
    expected: /Date is incorrect/,
  },
  {
    name: '5',
    dates: { year: 2000, month: 12, day: 12 },
    times: {
      hours: 24,
      minutes: 0,
    },
    expected: /Time is incorrect/,
  },
  {
    name: '6',
    dates: { year: 2000, month: 12, day: 12 },
    times: {
      hours: -1,
      minutes: 10,
    },
    expected: /Time is incorrect/,
  },
  {
    name: '7',
    dates: { year: 2000, month: 12, day: 12 },
    times: {
      hours: 23,
      minutes: 60,
    },
    expected: /Time is incorrect/,
  },
])('DynamoDateTime() $name -> $expected', ({ dates, times, expected }) => {
  expect(() => new DynamoDatetime({ dates, times })).toThrowError(expected)
})

test('DynamoDatetime: only date', () => {
  const ddt = new DynamoDatetime({ date: '2022-12-12' })
  expect(ddt.getIsoDatetime()).toBe('2022-12-12T00:00:00')
  expect(ddt.getTime()).toBeUndefined()
  expect(ddt.getDate()).toBe('2022-12-12')
  expect(ddt.getTimes()).toBeUndefined()
  expect(ddt.getDates()).toEqual({ year: 2022, month: 12, day: 12 })
})

test('DynamoDatetime: date and time', () => {
  const ddt = new DynamoDatetime({ date: '2022-12-12', time: '20:15' })
  expect(ddt.getIsoDatetime()).toBe('2022-12-12T20:15:00')
  expect(ddt.getTime()).toBe('20:15')
  expect(ddt.getDate()).toBe('2022-12-12')
  expect(ddt.getTimes()).toEqual({ hours: 20, minutes: 15 })
  expect(ddt.getDates()).toEqual({ year: 2022, month: 12, day: 12 })
})

test('DynamoDatetime format date fi', () => {
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 12 },
    }).getFormattedDate()
  ).toEqual('12.12.2022 (ma)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 13 },
    }).getFormattedDate()
  ).toEqual('13.12.2022 (ti)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 14 },
    }).getFormattedDate()
  ).toEqual('14.12.2022 (ke)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 15 },
    }).getFormattedDate()
  ).toEqual('15.12.2022 (to)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 16 },
    }).getFormattedDate()
  ).toEqual('16.12.2022 (pe)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 17 },
    }).getFormattedDate()
  ).toEqual('17.12.2022 (la)')
  expect(
    new DynamoDatetime({
      dates: { year: 2022, month: 12, day: 18 },
    }).getFormattedDate()
  ).toEqual('18.12.2022 (su)')
})
