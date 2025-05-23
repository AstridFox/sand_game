# simulation-engine

The **simulation-engine** package provides the core double-buffered grid and scheduler loop for the falling-sand simulation.

## Overview

- Maintains a current and next `Uint8Array` buffer of cell IDs representing a 2D grid.
- Executes each cell's update logic in ascending priority order, scanning rows in configurable directions.
- Supports optional horizontal jitter (random row offsets) and toggling scan directions between frames.

## Usage

```ts
import {
  dims,
  createGrid,
  createScanState,
  update,
} from 'simulation-engine';

// Initialize two buffers and scan state
let grid = createGrid(dims);
let newGrid = createGrid(dims);
const scanState = createScanState(/* toggleScanDirection */ true);

// cellMap: mapping from cell ID to cell definition (priority + update method)
// priorities: sorted list of numeric priority values (ascending)

// Run one simulation step (swap buffers each call)
[grid, newGrid] = update(
  grid,
  newGrid,
  cellMap,
  priorities,
  /* horizontalJitter */ false,
  scanState
);
```

## API

Refer to the TypeScript definitions for full signatures.