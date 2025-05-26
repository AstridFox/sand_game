# Extending the Project

This document explains how to extend the **simple-falling-sand-game** project with new cell types and custom behaviors. You can plug your own simulation logic into the existing packages and have it automatically available in the demo UI.

For detailed, package-specific instructions, see the respective READMEs:

- [behavior-library README](../packages/behavior-library/README.md)
- [simulation-engine README](../packages/simulation-engine/README.md)
- [ui-renderer README](../packages/ui-renderer/README.md)

## Adding a New Cell Type

Follow these steps to introduce a new cell in the behavior library:

1. **Define a unique ID**

   In `packages/behavior-library/src/ids.ts`, add a new constant at the end:

   ```ts
   // At the bottom of src/ids.ts
   export const MY_CELL = /* unique numeric ID */
   ```

2. **Create the cell configuration**

   In `packages/behavior-library/src/cells`, create `MyCell.ts`:

   ```ts
   import { MY_CELL } from '../ids'
   import type { CellConfig } from '../Cell'
   import { createFall } from '../behaviors/movement'

   const MyCell: CellConfig = {
     id: MY_CELL,
     name: 'MyCell',
     color: (x, y, t) => '#abcdef',
     priority: 1,
     behaviors: [
       createFall({
         allowed: [
           /* e.g. AIR */
         ],
       }),
     ],
   }

   export default MyCell
   ```

3. **Register your cell**

   Open `packages/behavior-library/src/index.ts`, import and append your cell config to the `configs` array:

   ```ts
   import MyCell from './cells/MyCell'

   const configs = [
     // ...existing cells
     MyCell,
   ]
   ```

Once these steps are complete, your new cell is part of the registry and ready to be used by the engine and UI.

## Adding a New Behavior

Custom behaviors let you implement arbitrary update logic for cells. To add one:

1. **Create a behavior factory**

   In `packages/behavior-library/src/behaviors`, create `myBehavior.ts`:

   ```ts
   import type { Behavior, Dims } from '../Cell'

   export function createMyBehavior(opts: {
     /* options */
   }): Behavior {
     return (_cell, index, grid, newGrid, dims) => {
       // custom logic here
       return false
     }
   }
   ```

2. **Use your behavior**

   Import your factory in your cell config (`MyCell.ts`) and include it in the `behaviors` array:

   ```ts
   import { createMyBehavior } from '../behaviors/myBehavior'

   // inside CellConfig.behaviors:
   createMyBehavior({ /* ... */ }),
   ```

## Rebuilding and Running

After adding new cells or behaviors, rebuild the library and demo:

```bash
yarn workspace behavior-library build
yarn build
yarn workspace web-demo dev
```

Now your custom cell types and behaviors will be available in the demo UI palette.
