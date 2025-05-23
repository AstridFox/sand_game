# Module & Layer Definitions

## behavior-library

- **What**: All cell types (Air, Sand, Water, Fire…) and their associated behavior pipelines. Exposes a registry for cell types to be registered, providing lookups by cell ID and by string name.
- **Why**: Keeps the _rules_ (physics, chemistry) decoupled from engine details

## simulation-engine

- **What**: Implements the double-buffered grid, scan ordering, scheduler, and overall simulation loop
- **Why**: Facilitates independent unit testing of core logic (e.g. “if a Sand falls, grid updates correctly”)

## ui-renderer

- **What**: Renders the grid into an HTML Canvas (or alternate target) and wires user input (brush, controls)
- **Why**: Allows swapping to a different UI (e.g. WebGL) without touching engine/behavior code

## web-demo (application)

- **What**: Glues everything together for a runnable demo
- **Why**: Keeps only high-level orchestration here; uses Vite for HMR and a simple entrypoint
- **File**: `apps/web-demo/src/main.ts` (similar to current `src/main.js`, but far leaner)