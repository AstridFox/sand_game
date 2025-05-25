# Extension Sample: BouncySand

This sample demonstrates how to add a **BouncySand** cell that falls like sand and occasionally bounces when it hits the ground.

## 1. Define a unique ID

In `packages/behavior-library/src/ids.ts`, add:

```ts
// At the bottom of src/ids.ts
export const BOUNCY_SAND = 14
```

Ensure the numeric ID (14) is unique across all entries.

## 2. Create the cell configuration

Create `packages/behavior-library/src/cells/BouncySand.ts`:

```ts
import { BOUNCY_SAND, AIR } from '../ids'
import type { CellConfig } from '../Cell'
import { createFall } from '../behaviors/movement'

const BouncySand: CellConfig = {
  id: BOUNCY_SAND,
  name: 'BouncySand',
  color: (x, y) => (x % 2 === 0 ? '#FF69B4' : '#FF1493'),
  priority: 1,
  behaviors: [
    // Falls downward like sand
    createFall({ allowed: [AIR] }),
    // Occasionally bounce up when blocked below
    (cell, index, _grid, newGrid, dims) => {
      const { width, height } = dims
      const y = Math.floor(index / width)
      if (y < height - 1) return false
      if (Math.random() < 0.1) {
        const above = index - width
        const target = newGrid[above]
        newGrid[above] = cell.id
        newGrid[index] = target
        return true
      }
      return false
    },
  ],
}

export default BouncySand
```

## 3. Register the cell

In `packages/behavior-library/src/index.ts`, import and append `BouncySand`:

```ts
import BouncySand from './cells/BouncySand'

const configs = [
  // ...existing cells
  BouncySand,
]
```

## 4. Rebuild and run the demo

```bash
yarn workspace behavior-library build
yarn build
yarn workspace web-demo dev
```

Open the web demo and select **BouncySand** in the palette. Watch it fall and bounce!