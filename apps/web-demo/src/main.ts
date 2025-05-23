import { createUI } from 'ui-renderer'
import { dims } from 'simulation-engine'

const container = document.getElementById('app')
if (!container) {
  throw new Error('App container element not found')
}

createUI({
  container,
  dims,
  cellSize: 4,
  horizontalJitter: true
})