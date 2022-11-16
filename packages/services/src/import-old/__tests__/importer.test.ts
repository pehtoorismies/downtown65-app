import { expect, test } from 'vitest'
import { importEvents } from '~/core/event'

test.skip('Import stuff', async () => {
  const { id } = await importEvents()
  expect(id).toBeDefined()
})
