import { AIR, SMOKE, ASH } from '../ids'
import type { Behavior } from '../Cell'

/** Spread a cell type to adjacent target cells with a given probability. */
export function createSpread(opts: {
  targets: number[]
  prob: number
}): Behavior {
  return (_cell, index, grid, newGrid, dims) => {
    const { width, height } = dims
    const y = Math.floor(index / width)
    const x = index % width
    if (
      y > 0 &&
      opts.targets.includes(grid[index - width]) &&
      Math.random() < opts.prob
    ) {
      newGrid[index - width] = grid[index]
    }
    if (
      y < height - 1 &&
      opts.targets.includes(grid[index + width]) &&
      Math.random() < opts.prob
    ) {
      newGrid[index + width] = grid[index]
    }
    if (
      x > 0 &&
      opts.targets.includes(grid[index - 1]) &&
      Math.random() < opts.prob
    ) {
      newGrid[index - 1] = grid[index]
    }
    if (
      x < width - 1 &&
      opts.targets.includes(grid[index + 1]) &&
      Math.random() < opts.prob
    ) {
      newGrid[index + 1] = grid[index]
    }
    return false
  }
}

/** Produce smoke above the cell with a given probability. */
export function createSmoke(opts: { prob: number }): Behavior {
  return (_cell, index, _grid, newGrid, dims) => {
    const { width } = dims
    const y = Math.floor(index / width)
    if (y > 0 && Math.random() < opts.prob && newGrid[index - width] === AIR) {
      newGrid[index - width] = SMOKE
    }
    return false
  }
}

/** Possibly extinguish the cell, turning into ash or air based on neighbors. */
export function createExtinguish(opts: {
  deathProb: number
  ashThreshold: number
}): Behavior {
  return (_cell, index, grid, newGrid, dims) => {
    if (Math.random() < opts.deathProb) {
      const { width, height } = dims
      const y = Math.floor(index / width)
      const x = index % width
      let ashCount = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          const ny = y + dy
          if (
            nx >= 0 &&
            nx < width &&
            ny >= 0 &&
            ny < height &&
            grid[ny * width + nx] === ASH
          ) {
            ashCount++
          }
        }
      }
      newGrid[index] = ashCount < opts.ashThreshold ? ASH : AIR
      return true
    }
    return false
  }
}

/** Possibly spawn a given target cell or result of factory at this position. */
export function createSpawn(opts: {
  target: number | (() => number)
  prob: number
}): Behavior {
  return (_cell, index, _grid, newGrid) => {
    if (Math.random() < opts.prob) {
      newGrid[index] =
        typeof opts.target === 'function' ? opts.target() : opts.target
    }
    return false
  }
}
