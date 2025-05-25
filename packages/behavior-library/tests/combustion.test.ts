import {
  createSpread,
  createSmoke,
  createExtinguish,
  createSpawn,
} from '../src/behaviors/combustion'
import { FIRE, WOOD, AIR, SMOKE, ASH } from '../src/ids'
import type { Dims, Cell } from '../src/Cell'

describe('combustion behaviors', () => {
  const dims: Dims = { width: 3, height: 3 }
  let grid: Uint8Array
  let newGrid: Uint8Array
  const center = 4

  beforeEach(() => {
    grid = new Uint8Array(dims.width * dims.height).fill(AIR)
    newGrid = new Uint8Array(grid)
    grid[center] = FIRE
    newGrid.set(grid)
  })

  test('createSpread always spreads with prob=1', () => {
    grid[center - dims.width] = WOOD
    const spread = createSpread({ targets: [WOOD], prob: 1 })
    spread({} as unknown as Cell, center, grid, newGrid, dims)
    expect(newGrid[center - dims.width]).toBe(FIRE)
  })

  test('createSmoke produces smoke above with prob=1', () => {
    const smoke = createSmoke({ prob: 1 })
    smoke({} as unknown as Cell, center, grid, newGrid, dims)
    expect(newGrid[center - dims.width]).toBe(SMOKE)
  })

  test('createExtinguish turns cell to ash with deathProb=1', () => {
    const extinguish = createExtinguish({ deathProb: 1, ashThreshold: 0 })
    const did = extinguish({} as unknown as Cell, center, grid, newGrid, dims)
    expect(did).toBe(true)
    expect(newGrid[center]).toBe(ASH)
  })

  test('createSpawn spawns cinder with prob=1', () => {
    const spawn = createSpawn({ target: ASH, prob: 1 })
    const did = spawn({} as unknown as Cell, center, grid, newGrid, dims)
    expect(did).toBe(false)
    expect(newGrid[center]).toBe(ASH)
  })
})
