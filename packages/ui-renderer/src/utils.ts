export function addTooltipListeners(
  element: HTMLElement,
  tooltip: HTMLElement,
  getText: (e: MouseEvent) => string,
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

export function setupPanelToggle(button: HTMLElement, panel: HTMLElement) {
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

  button.addEventListener('mouseenter', () => {
    show()
    const rect = button.getBoundingClientRect()
    panel.style.left = `${rect.right + 8}px`
    panel.style.top = `${rect.top}px`
  })
  button.addEventListener('mouseleave', hide)
  panel.addEventListener('mouseenter', show)
  panel.addEventListener('mouseleave', hide)
}

export function createSliderControl(
  labelText: string,
  min: number,
  max: number,
  initial: number,
  sliderClass: string,
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

export function createSeparator(
  className = 'palette-separator',
): HTMLHRElement {
  const hr = document.createElement('hr')
  hr.className = className
  return hr
}

/**
 * Parse a CSS hex color ("#rrggbb" or short form) or "rgb(r,g,b)" into an RGB tuple.
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  if (hex.startsWith('rgb(')) {
    const m = hex.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
    if (m) {
      return [Number(m[1]), Number(m[2]), Number(m[3])]
    }
    return null
  }
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(clean, 16)
  if (isNaN(num)) return null
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}
