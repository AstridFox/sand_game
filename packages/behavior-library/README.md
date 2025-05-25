# behavior-library

The **behavior-library** package provides all cell type definitions and their associated behavior pipelines for the falling sand simulation. It exposes a registry of cells for lookup by numeric ID or string name, as well as the raw behavior factories.

## Usage

Import the singleton registry to inspect or retrieve cell types:

```ts
import { registry } from 'behavior-library'

// Get a cell by name or ID
const sand = registry.getByName('Sand')
const air = registry.getById(0)
```

You can also import raw behavior factories and IDs:

```ts
import { ids, movement, combustion } from 'behavior-library'

// For example, use a fall behavior factory
const fallBehavior = movement.createFall({ allowed: [ids.AIR] })
```

## Adding a New Cell

1. Assign a unique constant in `src/ids.ts`.
2. Create a new cell configuration file in `src/cells`, for example `MyCell.ts`:

   ```ts
   import { MY_CELL } from '../ids'
   import type { CellConfig } from '../Cell'

   const MyCell: CellConfig = {
     id: MY_CELL,
     name: 'MyCell',
     color: (x, y, t) => '#abcdef',
     priority: 1,
     behaviors: [],
   }

   export default MyCell
   ```

3. Add your new cell to the `configs` array in `src/index.ts` so it is registered.

## Adding a New Behavior

1. Create a behavior factory in `src/behaviors`, following the signature:

   ```ts
   import type { Behavior, Dims } from '../Cell'

   export function createMyBehavior(opts: {
     /* ... */
   }): Behavior {
     return (_cell, index, grid, newGrid, dims) => {
       // behavior logic
       return false
     }
   }
   ```

2. Import and use your factory in any cell configuration.
