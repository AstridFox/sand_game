import { createCorrode } from '../src/behaviors/corrosion'
import { ACID, AIR, ROCK } from '../src/ids'
import type { Dims, Cell } from '../src/Cell'

describe('corrosion behavior', () => {
  const dims: Dims = { width: 3, height: 3 }
  let grid: Uint8Array
  let newGrid: Uint8Array
  const center = 4

  beforeEach(() => {
    grid = new Uint8Array(dims.width * dims.height).fill(AIR)
    newGrid = new Uint8Array(grid)
    grid[center] = ACID
    newGrid.set(grid)
  })

  test('createCorrode spreads acid to neighbor and removes solid target', () => {
    grid[center - 1] = ROCK
    const corrode = createCorrode({
      skip: [],
      solidTargets: [ROCK],
      spreadProb: 1,
    })
    const did = corrode(
      { id: ACID } as unknown as Cell,
      center,
      grid,
      newGrid,
      dims,
    )
    expect(did).toBe(true)
    expect(newGrid[center - 1]).toBe(ACID)
    expect(newGrid[center]).toBe(AIR)
  })
})
