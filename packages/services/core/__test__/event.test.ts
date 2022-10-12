import { test } from 'vitest'
import * as Event from '../event'

test('Match scopes', async () => {
  await Event.create({
    title: 'Title',
    race: false,
    dateStart: '2018-06-13T12:11:13',
    type: 'KARONKKA',
  })
})
