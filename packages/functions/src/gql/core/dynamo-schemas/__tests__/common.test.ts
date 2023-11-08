import { describe, expect, test } from 'vitest'
import { HyphenDate, getKeySchema } from '~/gql/core/dynamo-schemas/common'

describe('Common schema', () => {
  describe('HyphenDate', () => {
    test('date is correct', () => {
      expect(HyphenDate.safeParse('2023-02-02').success).toBe(true)
      expect(HyphenDate.safeParse('1977-11-30').success).toBe(true)
    })

    test('date is incorrect', () => {
      expect(HyphenDate.safeParse('2023-13-02').success).toBe(false)
      expect(HyphenDate.safeParse('1977-1-30').success).toBe(false)
      expect(HyphenDate.safeParse('1977-1-300').success).toBe(false)
    })
  })

  describe('Key schema', () => {
    test('EVENT schema is correct', () => {
      const eventKey = getKeySchema('EVENT')
      expect(
        eventKey.safeParse('EVENT#01HEQQYK3V9M5YEKRCX69KNYGT').success
      ).toBe(true)
      expect(
        eventKey.safeParse('EVENT#01HEQR6Z6XNRHRVC3EPGPDN563').success
      ).toBe(true)
    })

    test('CHALLENGE schema is correct', () => {
      const challengeKey = getKeySchema('CHALLENGE')
      expect(
        challengeKey.safeParse('CHALLENGE#01HEQQYK3V9M5YEKRCX69KNYGT').success
      ).toBe(true)
      expect(
        challengeKey.safeParse('CHALLENGE#01HEQR6Z6XNRHRVC3EPGPDN563').success
      ).toBe(true)
    })

    test('EVENT schema is incorrect', () => {
      const key = getKeySchema('EVENT')
      expect(key.safeParse('EVENT#01HEQR6Z6XNRHRVC3EPGPDN5').success).toBe(
        false
      )
      expect(
        key.safeParse('CHALLENGE#01HEQR6Z6XNRHRVC3EPGPDN563').success
      ).toBe(false)
    })

    test('CHALLENGE schema is incorrect', () => {
      const key = getKeySchema('CHALLENGE')
      expect(key.safeParse('CHALLENGE#01HEQR6Z6XNRHRVC3EPGPDN5').success).toBe(
        false
      )
      expect(key.safeParse('EVENT#01HEQR6Z6XNRHRVC3EPGPDN563').success).toBe(
        false
      )

      expect(key.safeParse('WRONG#01HEQR6Z6XNRHRVC3EPGPDN563').success).toBe(
        false
      )
    })
  })
})
