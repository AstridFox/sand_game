import { noise } from '../src/behaviors/utils'

describe('noise', () => {
  test('returns a value between 0 and 1', () => {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const v = noise(x, y)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThan(1)
      }
    }
  })
})
