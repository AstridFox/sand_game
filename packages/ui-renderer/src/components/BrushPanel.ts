import { addTooltipListeners, createSliderControl, setupPanelToggle } from '../utils'

export interface BrushPanelAPI {
  element: HTMLElement
  panel: HTMLElement
  getSize(): number
  getRoundness(): number
}

export function createBrushPanel(tooltip: HTMLElement): BrushPanelAPI {
  let brushSize = 1
  let brushRoundness = 0

  const brushButton = document.createElement('button')
  brushButton.className = 'brush-button'
  brushButton.textContent = '🖌️'
  addTooltipListeners(brushButton, tooltip, () => 'Brush')

  const brushPanel = document.createElement('div')
  brushPanel.className = 'brush-panel'

  const { control: sizeControl, slider: sizeSlider } =
    createSliderControl('Size', 1, 50, brushSize, 'brush-size-slider')
  brushPanel.appendChild(sizeControl)

  const { control: roundControl, slider: roundSlider } =
    createSliderControl(
      'Roundness',
      0,
      100,
      brushRoundness * 100,
      'brush-roundness-slider'
    )
  brushPanel.appendChild(roundControl)

  sizeSlider.addEventListener('input', () => {
    brushSize = Number(sizeSlider.value)
  })
  roundSlider.addEventListener('input', () => {
    brushRoundness = Number(roundSlider.value) / 100
  })

  setupPanelToggle(brushButton, brushPanel)

  return {
    element: brushButton,
    panel: brushPanel,
    getSize: () => brushSize,
    getRoundness: () => brushRoundness
  }
}