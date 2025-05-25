import type { Dims } from 'simulation-engine'

export interface CanvasViewAPI {
  wrapper: HTMLElement
  canvas: HTMLCanvasElement
  getCellCoord(e: MouseEvent): { x: number; y: number }
}

export function createCanvasView(dims: Dims, cellSize: number): CanvasViewAPI {
  const canvas = document.createElement('canvas')
  canvas.width = dims.width
  canvas.height = dims.height
  canvas.style.width = `${dims.width * cellSize}px`
  canvas.style.height = `${dims.height * cellSize}px`
  canvas.className = 'simulation-canvas'

  const wrapper = document.createElement('div')
  wrapper.className = 'simulation-wrapper'
  wrapper.appendChild(canvas)

  function getCellCoord(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = dims.width / rect.width
    const scaleY = dims.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    return { x, y }
  }

  return { wrapper, canvas, getCellCoord }
}
