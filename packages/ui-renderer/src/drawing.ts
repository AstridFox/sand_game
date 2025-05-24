import type { Dims } from 'simulation-engine'

export interface DrawingAPI {
  enableDrawing(
    canvas: HTMLCanvasElement,
    dims: Dims,
    getBrushSize: () => number,
    getBrushRoundness: () => number,
    getSelectedCellId: () => number,
    grid: number[]
  ): void
}

export function createDrawing(): DrawingAPI {
  function enableDrawing(
    canvas: HTMLCanvasElement,
    dims: Dims,
    getBrushSize: () => number,
    getBrushRoundness: () => number,
    getSelectedCellId: () => number,
    grid: number[]
  ) {
    let drawing = false

    const getCellCoord = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = dims.width / rect.width
      const scaleY = dims.height / rect.height
      const x = Math.floor((e.clientX - rect.left) * scaleX)
      const y = Math.floor((e.clientY - rect.top) * scaleY)
      return { x, y }
    }

    const drawAt = (e: MouseEvent) => {
      const { x: cx, y: cy } = getCellCoord(e)
      const brushSize = getBrushSize()
      const brushRoundness = getBrushRoundness()
      const r = brushSize / 2
      const thr = 1 + brushRoundness * (Math.SQRT2 - 1)
      const thrR = thr * r
      const thrRSq = thrR * thrR
      const limit = Math.ceil(r)
      for (let dy = -limit; dy <= limit; dy++) {
        for (let dx = -limit; dx <= limit; dx++) {
          if (dx * dx + dy * dy <= thrRSq) {
            const x = cx + dx
            const y = cy + dy
            if (x >= 0 && x < dims.width && y >= 0 && y < dims.height) {
              grid[y * dims.width + x] = getSelectedCellId()
            }
          }
        }
      }
    }

    canvas.addEventListener('mousedown', e => {
      drawing = true
      drawAt(e)
    })
    canvas.addEventListener('mousemove', e => drawing && drawAt(e))
    window.addEventListener('mouseup', () => {
      drawing = false
    })
  }

  return { enableDrawing }
}