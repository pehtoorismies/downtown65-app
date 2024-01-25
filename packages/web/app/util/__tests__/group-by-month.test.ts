import { plainToISO } from '@downtown65-app/core/time-functions'
import { expect, test } from 'vitest'
import { groupByMonth } from '~/util/group-by-month'

test('Group by month', () => {
  const events = [
    // 2022
    {
      dateStart: '2022-11-11',
      timeStart: '00:11',
      id: 1,
    },
    { dateStart: '2022-11-11', timeStart: '11:00', id: 2 },
    { dateStart: '2022-11-11', timeStart: '12:00', id: 3 },
    { dateStart: '2022-11-11', id: 4 },
    // 2023
    { dateStart: '2023-12-11', timeStart: '11:00', id: 5 },
    { dateStart: '2023-12-11', timeStart: '12:10', id: 6 },
    { dateStart: '2023-12-11', timeStart: '15:12', id: 7 },
    { dateStart: '2023-12-11', id: 8 },
    { dateStart: '2023-12-18', timeStart: '15:12', id: 9 },
  ].map((x) => plainToISO(x))

  const [first, second, third] = groupByMonth(events)

  expect(first.date).toBe('marraskuu 2022')
  expect(first.events[0].id).toBe(4)
  expect(first.events[1].id).toBe(1)
  expect(first.events[2].id).toBe(2)
  expect(first.events[3].id).toBe(3)

  expect(second.date).toBe('joulukuu 2023')
  expect(second.events[0].id).toBe(8)
  expect(second.events[1].id).toBe(5)
  expect(second.events[2].id).toBe(6)
  expect(second.events[3].id).toBe(7)
  expect(second.events[4].id).toBe(9)

  expect(third).toBeUndefined()
})
