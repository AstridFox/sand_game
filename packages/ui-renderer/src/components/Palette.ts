import registry from 'behavior-library'
import { addTooltipListeners, createSeparator } from '../utils'

export interface PaletteAPI {
  element: HTMLElement
  getSelectedCellId(): number
  onClear(cb: () => void): void
}

export function createPalette(tooltip: HTMLElement): PaletteAPI {
  const palette = document.createElement('div')
  palette.className = 'palette'

  palette.appendChild(createSeparator())

  let selectedCellId = registry.getByName('Sand')?.id ?? 0

  const updateSelection = (button: HTMLButtonElement) => {
    Array.from(palette.querySelectorAll('.palette-item.selected')).forEach(
      (el) => {
        el.classList.remove('selected')
      },
    )
    button.classList.add('selected')
    selectedCellId = Number(button.dataset.cellId)
  }

  registry.getAll().forEach((cell) => {
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

  palette.appendChild(createSeparator())

  const clearButton = document.createElement('button')
  clearButton.className = 'brush-button'
  clearButton.textContent = '🧹'
  addTooltipListeners(clearButton, tooltip, () => 'Clear Canvas')

  let clearCb: () => void
  clearButton.addEventListener('click', () => {
    clearCb?.()
  })
  palette.appendChild(clearButton)

  return {
    element: palette,
    getSelectedCellId: () => selectedCellId,
    onClear: (cb) => {
      clearCb = cb
    },
  }
}
