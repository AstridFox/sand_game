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

  const tooltip = document.createElement('div')
  tooltip.className = 'tooltip'
  root.appendChild(tooltip)

  const palette = document.createElement('div')
  palette.className = 'palette'

  let brushSize = 1
  let brushRoundness = 0

  const brushButton = document.createElement('button')
  brushButton.className = 'brush-button'
  brushButton.textContent = '🖌️'
  palette.appendChild(brushButton)

  const separator = document.createElement('hr')
  separator.className = 'palette-separator'
  palette.appendChild(separator)

  const brushPanel = document.createElement('div')
  brushPanel.className = 'brush-panel'

  const sizeControl = document.createElement('div')
  sizeControl.className = 'brush-control'
  const sizeLabel = document.createElement('label')
  sizeLabel.textContent = 'Size'
  const sizeSlider = document.createElement('input')
  sizeSlider.type = 'range'
  sizeSlider.min = '1'
  sizeSlider.max = '50'
  sizeSlider.value = brushSize.toString()
  sizeSlider.className = 'brush-size-slider'
  sizeControl.appendChild(sizeLabel)
  sizeControl.appendChild(sizeSlider)
  brushPanel.appendChild(sizeControl)

  const roundControl = document.createElement('div')
  roundControl.className = 'brush-control'
  const roundLabel = document.createElement('label')
  roundLabel.textContent = 'Roundness'
  const roundSlider = document.createElement('input')
  roundSlider.type = 'range'
  roundSlider.min = '0'
  roundSlider.max = '100'
  roundSlider.value = (brushRoundness * 100).toString()
  roundSlider.className = 'brush-roundness-slider'
  roundControl.appendChild(roundLabel)
  roundControl.appendChild(roundSlider)
  brushPanel.appendChild(roundControl)

  root.appendChild(brushPanel)

  sizeSlider.addEventListener('input', () => {
    brushSize = Number(sizeSlider.value)
  })
  roundSlider.addEventListener('input', () => {
    brushRoundness = Number(roundSlider.value) / 100
  })

  const showBrushPanel = () => brushPanel.classList.add('visible')
  const hideBrushPanel = (e: MouseEvent) => {
    const rectBtn = brushButton.getBoundingClientRect()
    const rectPanel = brushPanel.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    const xMin = Math.min(rectBtn.left, rectPanel.left)
    const xMax = Math.max(rectBtn.right, rectPanel.right)
    const yMin = Math.min(rectBtn.top, rectPanel.top)
    const yMax = Math.max(rectBtn.bottom, rectPanel.bottom)
    if (x < xMin || x > xMax || y < yMin || y > yMax) {
      brushPanel.classList.remove('visible')
    }
  }
  brushButton.addEventListener('mouseenter', (e: MouseEvent) => {
    showBrushPanel()
    const rect = brushButton.getBoundingClientRect()
    brushPanel.style.left = `${rect.right + 8}px`
    brushPanel.style.top = `${rect.top}px`
  })
  brushButton.addEventListener('mouseleave', hideBrushPanel)
  brushPanel.addEventListener('mouseenter', showBrushPanel)
  brushPanel.addEventListener('mouseleave', hideBrushPanel)

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
    button.dataset.cellId = cell.id.toString()

    button.addEventListener('mouseenter', (e: MouseEvent) => {
      tooltip.textContent = cell.name
      tooltip.style.left = `${(e.target.getBoundingClientRect().left + 48)}px`
      tooltip.style.top = `${e.target.getBoundingClientRect().top}px`
      tooltip.classList.add('visible')
    })
    button.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible')
    })

    const icon = document.createElement('div')
    icon.className = 'palette-item-icon'
    icon.style.background = cell.color(0, 0)
    button.appendChild(icon)

    button.addEventListener('click', () => updateSelection(button))
    palette.appendChild(button)

  })

  // Separator and clear-all button to reset canvas cells to Air
  const resetSeparator = document.createElement('hr')
  resetSeparator.className = 'palette-separator'
  palette.appendChild(resetSeparator)

  const clearButton = document.createElement('button')
  clearButton.className = 'brush-button'
  clearButton.textContent = '🧹'
  clearButton.addEventListener('mouseenter', (e: MouseEvent) => {
    tooltip.textContent = 'Clear Canvas'
    tooltip.style.left = `${(e.target.getBoundingClientRect().left + 48)}px`
    tooltip.style.top = `${e.target.getBoundingClientRect().top}px`
    tooltip.classList.add('visible')
  })
  clearButton.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible')
  })
  clearButton.addEventListener('click', () => {
    ;[grid, newGrid] = createGrids(dims)
  })
  palette.appendChild(clearButton)

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

  const wrapper = document.createElement('div')
  wrapper.className = 'simulation-wrapper'
  wrapper.appendChild(canvas)
  root.appendChild(wrapper)

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
    const { x: cx, y: cy } = getCellCoord(e)
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
            grid[y * dims.width + x] = selectedCellId
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