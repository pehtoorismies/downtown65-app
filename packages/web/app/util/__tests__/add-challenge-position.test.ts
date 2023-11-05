import { describe, expect, test } from 'vitest'
import { addChallengePosition } from '~/util/add-challenge-position'

describe('Challenge participant order', () => {
  test('multiple', () => {
    const participants = [7, 7, 7, 6, 6, 5, 2, 2, 1, 1, 1, 0, 0].map((x) => ({
      doneDatesCount: x,
    }))

    const result = addChallengePosition(participants)
    let index = 0
    expect(result[index++].position).toBe(1) // 7
    expect(result[index++].position).toBe(1)
    expect(result[index++].position).toBe(1)

    expect(result[index++].position).toBe(4) // 6
    expect(result[index++].position).toBe(4)

    expect(result[index++].position).toBe(6) // 5

    expect(result[index++].position).toBe(7) // 2
    expect(result[index++].position).toBe(7)

    expect(result[index++].position).toBe(9) // 1
    expect(result[index++].position).toBe(9)
    expect(result[index++].position).toBe(9)

    expect(result[index++].position).toBe(12) // 0
    expect(result[index++].position).toBe(12) // 0
  })

  test('single', () => {
    const participants = [7].map((x) => ({
      doneDatesCount: x,
    }))

    const result = addChallengePosition(participants)
    let index = 0
    expect(result[index++].position).toBe(1) // 7
  })
})
