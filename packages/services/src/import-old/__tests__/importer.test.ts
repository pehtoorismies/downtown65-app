import { expect, test } from 'vitest'
import { importEvents } from '~/core/event'

test('Import stuff', async () => {
  const { id } = await importEvents()
  expect(id).toBeDefined()
})
