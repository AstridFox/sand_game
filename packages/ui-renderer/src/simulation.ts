import {
  createGrids,
  createScanState,
  update as updateSim,
  type Dims,
  type ScanState,
  type CellDefinition,
} from 'simulation-engine'
import registry from 'behavior-library'
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

  const idToRgb: [number, number, number][] = []
  cells.forEach((c) => {
    const hex = c.color(0, 0)
    const rgb = hexToRgb(hex)
    idToRgb[c.id] = rgb || [0, 0, 0]
  })

  const AIR_ID = registry.getByName('Air')?.id ?? 0

  function startLoop(
    ctx: CanvasRenderingContext2D,
    dims: Dims,
    horizontalJitter: () => boolean,
  ) {
    ctx.imageSmoothingEnabled = false
    const imageData = ctx.createImageData(dims.width, dims.height)

    function frame() {
      ;[grid, newGrid] = updateSim(
        grid,
        newGrid,
        cellMap,
        priorities,
        horizontalJitter,
        scanState,
      )

      const data = imageData.data
      for (let i = 0; i < grid.length; i++) {
        const id = grid[i]
        const [r, g, b] = idToRgb[id]
        const idx = i * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
        data[idx + 3] = id === AIR_ID ? 0 : 255
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
      [grid, newGrid] = createGrids(newDims)
    }
  }

  return { startLoop, getScanState, getGrid, reset }
}
