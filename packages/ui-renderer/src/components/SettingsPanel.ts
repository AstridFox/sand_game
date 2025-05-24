import { addTooltipListeners, setupPanelToggle } from '../utils'
import type { ScanState } from 'simulation-engine'

export interface SettingsPanelAPI {
  element: HTMLElement
  panel: HTMLElement
  onJitterChange(cb: (on: boolean) => void): void
  onScanToggle(cb: (on: boolean) => void): void
}

export function createSettingsPanel(
  tooltip: HTMLElement,
  initialJitter: boolean,
  scanState: ScanState
): SettingsPanelAPI {
  const settingsButton = document.createElement('button')
  settingsButton.className = 'brush-button'
  settingsButton.textContent = '⚙️'
  addTooltipListeners(settingsButton, tooltip, () => 'Settings')

  const settingsPanel = document.createElement('div')
  settingsPanel.className = 'settings-panel'

  const jitterControl = document.createElement('div')
  jitterControl.className = 'settings-control'
  const jitterCheckbox = document.createElement('input')
  jitterCheckbox.type = 'checkbox'
  jitterCheckbox.checked = initialJitter
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

  setupPanelToggle(settingsButton, settingsPanel)

  scanCheckbox.addEventListener('change', () => {
    scanState.toggleScanDirection = scanCheckbox.checked
  })

  return {
    element: settingsButton,
    panel: settingsPanel,
    onJitterChange: cb => {
      jitterCheckbox.addEventListener('change', () => cb(jitterCheckbox.checked))
    },
    onScanToggle: cb => {
      scanCheckbox.addEventListener('change', () => cb(scanCheckbox.checked))
    }
  }
}