import { registry } from '../src'
import { AIR, SAND } from '../src/ids'

describe('CellRegistry', () => {
  test('lookup by ID and name', () => {
    const sand = registry.getById(SAND)
    expect(sand).toBeDefined()
    if (!sand) {
      throw new Error('Expected sand to be defined')
    }
    expect(registry.getByName(sand.name)).toBe(sand)
    const air = registry.getByName('Air')
    expect(air).toBeDefined()
    expect(registry.getById(AIR)).toBe(air)
  })

  test('getAll returns all cells', () => {
    const all = registry.getAll()
    expect(Array.isArray(all)).toBe(true)
    expect(all.length).toBeGreaterThan(0)
  })
})
