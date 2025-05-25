# Project Architecture

This document outlines the overall architecture and components of the **simple-falling-sand-game** monorepo.
For installation and setup instructions, see the [top-level README](../README.md).

## Monorepo Layout

```text
simple-falling-sand-game/
├── packages/
│   ├── behavior-library/     # Defines cell types and behavior pipelines
│   ├── simulation-engine/    # Core simulation loop (double-buffered grid & scheduler)
│   └── ui-renderer/          # Canvas rendering & UI controls
├── apps/
│   └── web-demo/             # Web application demo (Vite-powered)
├── docs/                     # Project documentation
├── package.json              # Yarn workspace configuration & scripts
└── tsconfig.base.json        # Shared TypeScript settings
```

## Packages & Workspaces

### behavior-library

- Provides a set of pluggable **behaviors** for individual cell types.
- Defines rules (e.g., gravity, diffusion, interaction) that are executed by the simulation engine.

### simulation-engine

- Core engine that drives the simulation:
  - Maintains a double-buffered 2D grid of cells.
  - Runs a scheduler loop to apply behaviors to each cell on every tick.
- Produces updated grid states at the configured frame rate.

### ui-renderer

- Renders grid states to an HTML `<canvas>` element.
- Offers UI controls (brush, pan, zoom, material picker) to interact with the simulation.
- Framework-agnostic API for embedding in any host application.

### web-demo

- Demonstrates the complete application in a browser environment.
- Bootstraps `simulation-engine`, `behavior-library`, and `ui-renderer`.
- Powered by Vite for fast development (hot reload) and optimized production bundles.

## Data Flow & Interaction

```text
   behavior-library   simulation-engine   ui-renderer
           │                   │              │
           └───► behaviors ───►│              │
                               ├───► grid ────►│
                               │              ▼
                          updated grid      canvas
                               ▲              │
           ┌───────────────────┘              │
           │                                  ▼
       web-demo  ◄───── user input/control ─── ui-renderer
```

1. **web-demo** initializes the simulation engine and behavior registry.
2. **simulation-engine** invokes registered behaviors to update the grid.
3. **ui-renderer** draws the new grid state and captures user events.
4. User interactions (e.g., painting cells) modify the grid or behavior config.
5. Loop continues at the configured simulation tick rate.

## Build & Development Workflow

- **Build all packages**: `yarn build` (runs `build` in each workspace, output to `dist/`).
- **Run demo locally**:
  - `yarn workspace web-demo dev` — start Vite development server.
  - `yarn build && yarn workspace web-demo preview` — build and preview production bundle.
- **Testing & Linting**:
  - `yarn test` — execute tests across workspaces.
  - `yarn lint && yarn format` — run ESLint and Prettier on the codebase.

## Extending & Integrating

- Import any package directly from `packages/*` in external projects.
- Add new behaviors by extending the behavior library and registering them with the engine.
- Embed `ui-renderer` in custom interfaces beyond the provided web-demo (e.g., desktop apps).

For more detailed API references, see the individual package READMEs in `packages/`.
