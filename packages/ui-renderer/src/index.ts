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

// Helper to show tooltip on element hover
function addTooltipListeners(
  element: HTMLElement,
  tooltip: HTMLElement,
  getText: (e: MouseEvent) => string
) {
  element.addEventListener('mouseenter', (e: MouseEvent) => {
    tooltip.textContent = getText(e)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    tooltip.style.left = `${rect.left + 48}px`
    tooltip.style.top = `${rect.top}px`
    tooltip.classList.add('visible')
  })
  element.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible')
  })
}

// Helper to toggle visibility of a panel next to a button
function setupPanelToggle(button: HTMLElement, panel: HTMLElement) {
  const show = () => panel.classList.add('visible')
  const hide = (e: MouseEvent) => {
    const rectBtn = button.getBoundingClientRect()
    const rectPanel = panel.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    const xMin = Math.min(rectBtn.left, rectPanel.left)
    const xMax = Math.max(rectBtn.right, rectPanel.right)
    const yMin = Math.min(rectBtn.top, rectPanel.top)
    const yMax = Math.max(rectBtn.bottom, rectPanel.bottom)
    if (x < xMin || x > xMax || y < yMin || y > yMax) {
      panel.classList.remove('visible')
    }
  }

  button.addEventListener('mouseenter', (e: MouseEvent) => {
    show()
    const rect = button.getBoundingClientRect()
    panel.style.left = `${rect.right + 8}px`
    panel.style.top = `${rect.top}px`
  })
  button.addEventListener('mouseleave', hide)
  panel.addEventListener('mouseenter', show)
  panel.addEventListener('mouseleave', hide)
}

// Helper to create a labeled range slider control
function createSliderControl(
  labelText: string,
  min: number,
  max: number,
  initial: number,
  sliderClass: string
): { control: HTMLDivElement; slider: HTMLInputElement } {
  const control = document.createElement('div')
  control.className = 'brush-control'
  const label = document.createElement('label')
  label.textContent = labelText
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = String(min)
  slider.max = String(max)
  slider.value = initial.toString()
  slider.className = sliderClass
  control.appendChild(label)
  control.appendChild(slider)
  return { control, slider }
}

// Helper to create a separator line
function createSeparator(className = 'palette-separator'): HTMLHRElement {
  const hr = document.createElement('hr')
  hr.className = className
  return hr
}

/**
 * Parse a CSS hex color ("#rrggbb" or short form) or "rgb(r,g,b)" into an RGB tuple.
 */
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

export interface UIOptions {
  container: HTMLElement
  dims: Dims
  cellSize?: number
  horizontalJitter?: boolean
}

export function createUI(options: UIOptions): void {
  const { container, dims, cellSize = 4 } = options
  let horizontalJitter = options.horizontalJitter ?? false

  // Simulation state (grids and scan direction)
  let [grid, newGrid] = createGrids(dims)
  const scanState: ScanState = createScanState()

  // Clear and prepare root container
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

  palette.appendChild(createSeparator())

  const brushPanel = document.createElement('div')
  brushPanel.className = 'brush-panel'

  const { control: sizeControl, slider: sizeSlider } = 
    createSliderControl('Size', 1, 50, brushSize, 'brush-size-slider')
  brushPanel.appendChild(sizeControl)

  const { control: roundControl, slider: roundSlider } =
    createSliderControl('Roundness', 0, 100, brushRoundness * 100,
    'brush-roundness-slider')
  brushPanel.appendChild(roundControl)

  root.appendChild(brushPanel)

  sizeSlider.addEventListener('input', () => {
    brushSize = Number(sizeSlider.value)
  })
  roundSlider.addEventListener('input', () => {
    brushRoundness = Number(roundSlider.value) / 100
  })

  setupPanelToggle(brushButton, brushPanel)

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

    addTooltipListeners(button, tooltip, () => cell.name)

    const icon = document.createElement('div')
    icon.className = 'palette-item-icon'
    icon.style.background = cell.color(0, 0)
    button.appendChild(icon)

    button.addEventListener('click', () => updateSelection(button))
    palette.appendChild(button)

  })

  // Separator and clear-all button to reset canvas cells to Air
  palette.appendChild(createSeparator())

  const clearButton = document.createElement('button')
  clearButton.className = 'brush-button'
  clearButton.textContent = '🧹'
  addTooltipListeners(clearButton, tooltip, () => 'Clear Canvas')
  clearButton.addEventListener('click', () => {
    ;[grid, newGrid] = createGrids(dims)
  })
  palette.appendChild(clearButton)

  const gearButton = document.createElement('button')
  gearButton.className = 'brush-button'
  gearButton.textContent = '⚙️'
  addTooltipListeners(gearButton, tooltip, () => 'Settings')
  palette.appendChild(gearButton)

  // Settings panel (horizontal jitter & scan direction)
  const settingsPanel = document.createElement('div')
  settingsPanel.className = 'settings-panel'

  const jitterControl = document.createElement('div')
  jitterControl.className = 'settings-control'
  const jitterCheckbox = document.createElement('input')
  jitterCheckbox.type = 'checkbox'
  jitterCheckbox.checked = horizontalJitter
  const jitterLabel = document.createElement('label')
  jitterLabel.textContent = 'Horizontal Jitter'
  jitterControl.appendChild(jitterCheckbox)
  jitterControl.appendChild(jitterLabel)

  const scanControl = document.createElement('div')
  scanControl.className = 'settings-control'
  const scanCheckbox = document.createElement('input')
  scanCheckbox.type = 'checkbox'
  scanCheckbox.checked = scanState.toggleScanDirection
  const scanLabel = document.createElement('label')
  scanLabel.textContent = 'Toggle Scan Direction'
  scanControl.appendChild(scanCheckbox)
  scanControl.appendChild(scanLabel)

  settingsPanel.appendChild(jitterControl)
  settingsPanel.appendChild(scanControl)
  root.appendChild(settingsPanel)

  setupPanelToggle(gearButton, settingsPanel)

  jitterCheckbox.addEventListener('change', () => {
    horizontalJitter = jitterCheckbox.checked
  })
  scanCheckbox.addEventListener('change', () => {
    scanState.toggleScanDirection = scanCheckbox.checked
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

  const wrapper = document.createElement('div')
  wrapper.className = 'simulation-wrapper'
  wrapper.appendChild(canvas)
  root.appendChild(wrapper)

  // Attach UI to the container
  container.appendChild(root)

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

  const AIR_ID = registry.getByName('Air')?.id ?? 0

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
      data[idx + 3] = id === AIR_ID ? 0 : 255
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