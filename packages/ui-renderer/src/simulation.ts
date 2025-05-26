import {
  createGrids,
  createScanState,
  update as updateSim,
  type Dims,
  type ScanState,
  type CellDefinition,
} from 'simulation-engine'
import registry, { growth } from 'behavior-library'
import { hexToRgb } from './utils'

export interface SimulationAPI {
  startLoop(
    ctx: CanvasRenderingContext2D,
    dims: Dims,
    horizontalJitter: () => boolean,
  ): void
  getScanState(): ScanState
  getGrid(): number[]
  reset(dims: Dims): void
}

export function createSimulation(dims: Dims): SimulationAPI {
  let [grid, newGrid] = createGrids(dims)
  const scanState: ScanState = createScanState()

  const cells = registry.getAll()
  const cellMap: Record<number, CellDefinition> = {}
  cells.forEach((c) => {
    cellMap[c.id] = c
  })

  const priorities = Array.from(new Set(cells.map((c) => c.priority))).sort(
    (a, b) => a - b,
  )

  const AIR_ID = registry.getByName('Air')?.id ?? 0

  function startLoop(
    ctx: CanvasRenderingContext2D,
    dims: Dims,
    horizontalJitter: () => boolean,
  ) {
    ctx.imageSmoothingEnabled = false
    const imageData = ctx.createImageData(dims.width, dims.height)
    let lastTime = performance.now()

    function frame() {
      const now = performance.now()
      const delta = now - lastTime
      lastTime = now
      ;[grid, newGrid] = updateSim(
        grid,
        newGrid,
        cellMap,
        priorities,
        horizontalJitter,
        scanState,
      )
      growth.processGrowth(grid, dims)

      const data = imageData.data
      for (let i = 0; i < grid.length; i++) {
        const id = grid[i]
        const idx = i * 4
        if (id === AIR_ID) {
          data[idx] = 0
          data[idx + 1] = 0
          data[idx + 2] = 0
          data[idx + 3] = 0
        } else {
          const x = i % dims.width
          const y = Math.floor(i / dims.width)
          const hex = cellMap[id].color(x, y, delta)
          const rgb = hexToRgb(hex) || [0, 0, 0]
          data[idx] = rgb[0]
          data[idx + 1] = rgb[1]
          data[idx + 2] = rgb[2]
          data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  function getScanState(): ScanState {
    return scanState
  }

  function getGrid(): number[] {
    return grid
  }

  function reset(newDims: Dims): void {
    if (newDims.width === dims.width && newDims.height === dims.height) {
      grid.fill(AIR_ID)
      newGrid.fill(AIR_ID)
    } else {
      ;[grid, newGrid] = createGrids(newDims)
    }
  }

  return { startLoop, getScanState, getGrid, reset }
}
