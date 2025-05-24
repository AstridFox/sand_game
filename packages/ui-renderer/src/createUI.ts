import './style.css'
import type { Dims } from 'simulation-engine'
import { createBrushPanel } from './components/BrushPanel'
import { createSettingsPanel } from './components/SettingsPanel'
import { createPalette } from './components/Palette'
import { createCanvasView } from './components/CanvasView'
import { createSimulation } from './simulation'
import { createDrawing } from './drawing'

export interface UIOptions {
  container: HTMLElement
  dims: Dims
  cellSize?: number
  horizontalJitter?: boolean
}

export function createUI(options: UIOptions): void {
  const { container, dims, cellSize = 4 } = options
  let horizontalJitter = options.horizontalJitter ?? false

  container.innerHTML = ''

  const root = document.createElement('div')
  root.className = 'ui-root'
  const tooltip = document.createElement('div')
  tooltip.className = 'tooltip'
  root.appendChild(tooltip)

  const brush = createBrushPanel(tooltip)
  const palette = createPalette(tooltip, dims)
  palette.element.prepend(brush.element)
  
  const simulation = createSimulation(dims)
  const settings = createSettingsPanel(
    tooltip,
    horizontalJitter,
    simulation.getScanState()
  )
  const canvasView = createCanvasView(dims, cellSize)
  const drawing = createDrawing()

  brush.panel && root.appendChild(brush.panel)
  palette.element && root.appendChild(palette.element)
  settings.panel && root.appendChild(settings.panel)
  palette.element.appendChild(settings.element)

  container.appendChild(root)
  root.appendChild(canvasView.wrapper)

  simulation.startLoop(
    canvasView.canvas.getContext('2d')!,
    dims,
    () => horizontalJitter
  )
  drawing.enableDrawing(
    canvasView.canvas,
    dims,
    () => brush.getSize(),
    () => brush.getRoundness(),
    () => palette.getSelectedCellId(),
    simulation.getGrid()
  )

  settings.onJitterChange(on => {
    horizontalJitter = on
  })
  settings.onScanToggle(on => {
    simulation.getScanState().toggleScanDirection = on
  })
  palette.onClear(() => simulation.reset(dims))
}