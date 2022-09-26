import { assert, expect, test } from 'vitest'
import { matchScopes } from '../match-scopes'

test('Match scopes', () => {
  const match = matchScopes(['read:events', 'write:events'])

  expect(match('wrong')).toBe(false)
  expect(match('wrong update:events')).toBe(false)
  expect(match('')).toBe(false)

  expect(match('read:events write:events')).toBe(true)
  expect(match('read:events')).toBe(true)
  expect(match('write:events')).toBe(true)
  expect(match('write:events someOtherScope')).toBe(true)
})
