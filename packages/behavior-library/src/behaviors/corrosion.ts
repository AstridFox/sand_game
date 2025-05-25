import { AIR } from '../ids'
import type { Behavior } from '../Cell'

/** Corrode adjacent cells into this cell type with given spread probability. */
export function createCorrode(opts: {
  skip?: number[]
  solidTargets?: number[]
  spreadProb: number
}): Behavior {
  return (cell, index, grid, newGrid, dims) => {
    const { width, height } = dims
    const y = Math.floor(index / width)
    const x = index % width
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
        const ni = ny * width + nx
        const targetId = grid[ni]
        if (targetId === cell.id || opts.skip?.includes(targetId)) continue
        if (Math.random() < opts.spreadProb) {
          newGrid[ni] = cell.id
          if (opts.solidTargets?.includes(targetId)) {
            newGrid[index] = AIR
            return true
          }
        }
      }
    }
    return false
  }
}
