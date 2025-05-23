# ui-renderer

Canvas rendering and UI controls for the falling sand simulation.

## Features

- Dark-themed, sleek and modern UI layout
- Simulation canvas with pixelated rendering
- Cell palette with icons for each cell type
- Click and drag to draw cells
- Brush tool with size and roundness controls (hover the 🖌️ icon above the cell palette)

## Usage

Import and initialize the UI in your application:

```ts
import { createUI } from 'ui-renderer'
import { dims } from 'simulation-engine'

const container = document.getElementById('app')
if (!container) {
  throw new Error('Container element not found')
}

createUI({
  container,
  dims,
  cellSize: 4,          // optional, default is 4
  horizontalJitter: true // optional, default is false
})
```

The UI will mount a full-height dark layout with a cell palette and simulation canvas.