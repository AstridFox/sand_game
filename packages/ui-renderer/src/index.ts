import './style.css'

import registry from 'behavior-library'
import {
  createGrids,
  createScanState,
  update as updateSim,
  type Dims,
  type ScanState,
  type CellDefinition
} from 'simulation-engine'

export interface UIOptions {
  container: HTMLElement
  dims: Dims
  cellSize?: number
  horizontalJitter?: boolean
}

export function createUI(options: UIOptions): void {
  const { container, dims, cellSize = 4, horizontalJitter = false } = options

  container.innerHTML = ''

  const root = document.createElement('div')
  root.className = 'ui-root'

  const palette = document.createElement('div')
  palette.className = 'palette'

  let selectedCellId = registry.getByName('Sand')?.id ?? 0

  const updateSelection = (button: HTMLButtonElement) => {
    Array.from(palette.querySelectorAll('.palette-item.selected')).forEach(el => {
      el.classList.remove('selected')
    })
    button.classList.add('selected')
    selectedCellId = Number(button.dataset.cellId)
  }

  registry.getAll().forEach(cell => {
    const button = document.createElement('button')
    button.className = 'palette-item'
    button.title = cell.name
    button.dataset.cellId = cell.id.toString()

    const icon = document.createElement('div')
    icon.className = 'palette-item-icon'
    icon.style.background = cell.color(0, 0)
    button.appendChild(icon)

    button.addEventListener('click', () => updateSelection(button))
    palette.appendChild(button)

  })

  root.appendChild(palette)

  const canvas = document.createElement('canvas')
  canvas.className = 'simulation-canvas'
  canvas.width = dims.width
  canvas.height = dims.height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2D rendering context')
  }
  ctx.imageSmoothingEnabled = false

  canvas.style.width = `${dims.width * cellSize}px`
  canvas.style.height = `${dims.height * cellSize}px`
  root.appendChild(canvas)

  container.appendChild(root)

  let [grid, newGrid] = createGrids(dims)
  const scanState: ScanState = createScanState()

  const cells = registry.getAll()
  const cellMap: Record<number, CellDefinition> = {}
  cells.forEach(c => {
    cellMap[c.id] = c
  })

  const priorities = Array.from(
    new Set(cells.map(c => c.priority))
  ).sort((a, b) => a - b)

  const idToRgb: [number, number, number][] = []
  cells.forEach(c => {
    const hex = c.color(0, 0)
    const rgb = hexToRgb(hex)
    idToRgb[c.id] = rgb || [0, 0, 0]
  })

  const imageData = ctx.createImageData(dims.width, dims.height)

  function frame() {
    ;[grid, newGrid] = updateSim(
      grid,
      newGrid,
      cellMap,
      priorities,
      horizontalJitter,
      scanState
    )

    const data = imageData.data
    for (let i = 0; i < grid.length; i++) {
      const id = grid[i]
      const [r, g, b] = idToRgb[id]
      const idx = i * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = id === registry.getByName('Air')?.id ? 0 : 255
    }

    ctx.putImageData(imageData, 0, 0)
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

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
    const { x, y } = getCellCoord(e)
    if (x >= 0 && x < dims.width && y >= 0 && y < dims.height) {
      grid[y * dims.width + x] = selectedCellId
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

function hexToRgb(hex: string): [number, number, number] | null {
  if (hex.startsWith('rgb(')) {
    const m = hex.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
    if (m) {
      return [Number(m[1]), Number(m[2]), Number(m[3])]
    }
    return null
  }
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('')
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return null
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}