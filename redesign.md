Below is a complete design proposal for a ground‐up rewrite of the “Simple Falling Sand Game” into a more modular, maintainable,
 and testable codebase. The old version of the game is in the ./OLD directory. I’ve broken this proposal into the following sections:

    1. **Executive Summary & Goals**
    2. **Current State (for context)**
    3. **High‑Level Architectural Vision**
    4. **Technology Stack Recommendations**
    5. **Directory & Package Layout**
    6. **Module & Layer Definitions**
    7. **Testing Strategy**
    8. **Documentation & Onboarding**
    9. **Build, Dev & Release Workflow**
    10. **Migration Roadmap**

This design document also appears in the ./redesign.md file in the project directory.

-------------------------------------------------------------------------------------------------------------------------------

## 1. Executive Summary & Goals

Why rewrite?
Over time, single‑file ES modules, a custom Python livereload server, and a flat directory structure have led to:

    * **Tight coupling** of simulation logic and rendering/UI code
    * **Difficult test isolation** (e.g. hard to unit‑test physics without DOM/Canvas)
    * **Scaling pain** as new behaviors or UI features proliferate
    * **Manual tooling** (Python server, ad hoc rollup config) that is brittle

Our rewrite goals are:

┌────────────────────┬─────────────────────────────────────────┐
│ Goal               │ Benefit                                 │
├────────────────────┼─────────────────────────────────────────┤
│ Clear layering     │ Isolation of core “engine” from UI      │
├────────────────────┼─────────────────────────────────────────┤
│ Strong typing      │ Catch many errors at compile‑time       │
├────────────────────┼─────────────────────────────────────────┤
│ Modular packages   │ Independent releases, dependencies      │
├────────────────────┼─────────────────────────────────────────┤
│ Robust testing     │ Fast, in‑IDE unit tests with coverage   │
├────────────────────┼─────────────────────────────────────────┤
│ Modern dev tooling │ Instant HMR, simpler scripts            │
├────────────────────┼─────────────────────────────────────────┤
│ Rich documentation │ Easier onboarding & API discoverability │
└────────────────────┴─────────────────────────────────────────┘

Non‑goals for this rewrite: rewriting every minor algorithm, changing the “feel” of the game, or adding new gameplay features
beyond what’s needed to prove the modular architecture.

-------------------------------------------------------------------------------------------------------------------------------

## 2. Current State (for context)

To set the stage, here is an excerpt of the current code structure and some key existing docs:

    ./OLD/
    ├── docs/
    │   ├── architecture.md
    │   └── behavior-api.md
    ├── src/
    │   ├── cells/
    │   │   └── behaviors/
    │   ├── renderer.js
    │   ├── ui.js
    │   ├── config.js
    │   ├── main.js
    │   ├── scheduler.js
    │   └── input.js
    ├── public/
    ├── scripts/serve.py
    ├── test/movement.test.js
    ├── jest.config.js
    └── rollup.config.js

docs/architecture.md (/Users/erika/sand/docs/architecture.md)docs/behavior-api.md (/Users/erika/sand/docs/behavior-api.md)

-------------------------------------------------------------------------------------------------------------------------------

## 3. High‑Level Architectural Vision

At a high level, we’ll split the system into four main logical layers:

    ┌────────────────────────┐
    │        App (CLI/Web)   │   ← Entrypoint, orchestration
    └────────────────────────┘
               ↓
    ┌────────────────────────┐
    │      UI Layer          │   ← Canvas rendering, DOM controls
    └────────────────────────┘
               ↓
    ┌────────────────────────┐
    │   Simulation Engine    │   ← Grid, scheduler, update loop
    └────────────────────────┘
               ↓
    ┌────────────────────────┐
    │    Behavior Library    │   ← Cell definitions & behavior rules
    └────────────────────────┘

Each layer depends only on the layer(s) beneath it.  This clean separation will allow us to:

    * **Unit‑test engine/behavior** without Canvas/DOM
    * **Swap out** the UI (e.g. different renderers) without touching the physics
    * **Evolve** behaviors (e.g. add new chemistry rules) in isolation

-------------------------------------------------------------------------------------------------------------------------------

## 4. Technology Stack Recommendations

┌──────────────────────┬─────────────────────────────────────────┐
│ Concern              │ Recommendation                          │
├──────────────────────┼─────────────────────────────────────────┤
│ Language             │ TypeScript (strict mode)                │
├──────────────────────┼─────────────────────────────────────────┤
│ Bundler / Dev Server │ Vite (built‑in HMR, fast rebuilds)      │
├──────────────────────┼─────────────────────────────────────────┤
│ Testing              │ Jest + ts‑junit / Vitest (node + jsdom) │
├──────────────────────┼─────────────────────────────────────────┤
│ Lint / Format        │ ESLint + Prettier                       │
├──────────────────────┼─────────────────────────────────────────┤
│ Package Management   │ npm/Yarn workspaces (monorepo style)    │
├──────────────────────┼─────────────────────────────────────────┤
│ Docs                 │ Markdown + typedoc for package APIs     │
├──────────────────────┼─────────────────────────────────────────┤
│ CI                   │ GitHub Actions (lint/test on push & PR) │
└──────────────────────┴─────────────────────────────────────────┘

TypeScript brings type safety to dims, Cell configs, behavior factories, etc., and drastically improves editor auto‑completion
when designing new cells or rules.

-------------------------------------------------------------------------------------------------------------------------------

## 5. Directory & Package Layout

We’ll adopt a monorepo layout with three publishable packages (engine, behaviors, ui), all under a single workspace.  This keeps
 things modular but still easy to develop locally.

    /
    ├── docs/                       ← High‑level design docs, markdown
    │   └── ...
    ├── packages/
    │   ├── behavior-library/       ← Pure behavior rules & factories
    │   │   ├── src/
    │   │   ├── tests/
    │   │   ├── package.json
    │   │   └── README.md
    │   ├── simulation-engine/      ← Grid, scheduler, simulation loop
    │   │   ├── src/
    │   │   ├── tests/
    │   │   ├── package.json
    │   │   └── README.md
    │   └── ui-renderer/            ← Canvas + controls UI layer
    │       ├── src/
    │       ├── tests/              ← e.g. jsdom & canvas-mock
    │       ├── package.json
    │       └── README.md
    ├── apps/
    │   └── web-demo/               ← The browser demo application
    │       ├── public/
    │       ├── src/
    │       ├── index.html
    │       ├── vite.config.ts
    │       └── package.json
    ├── scripts/                    ← Dev‐ops scripts (e.g. release)
    │   └── ...
    ├── package.json                ← Workspace config & top‐level scripts
    └── tsconfig.base.json          ← Shared TS config

Key points:

    * **`behavior-library`** exports cell IDs, metadata, color maps, and behavior factories (fall, fluid, combustion, etc.).
    * **`simulation-engine`** consumes behaviors + cell configs, implements the double‑buffered grid and scheduler loop.
    * **`ui-renderer`** wires up a Canvas (or any render target) and user input (brush, slider controls).
    * **`apps/web-demo`** ties engine + behaviors + UI into a runnable demo with Vite for HMR.

-------------------------------------------------------------------------------------------------------------------------------

## 6. Module & Layer Definitions

### 6.1 behavior-library

    * **What**: All cell types (Air, Sand, Water, Fire…) and their associated behavior pipelines. Exposes a registry for cells types to be registered which provides cell type lookups by cell ID and by string name.
    * **Why**: Keeps the _rules_ (physics, chemistry) decoupled from engine details

### 6.2 simulation-engine

    * **What**: Implements the double‑buffered grid, scan ordering, scheduler, and overall simulation loop
    * **Why**: Facilitates independent unit testing of core logic (e.g. “if a Sand falls, grid updates correctly”)

### 6.3 ui-renderer

    * **What**: Renders the grid into an HTML Canvas (or alternate target) and wires user input (brush, controls)
    * **Why**: Allows swapping to a different UI (e.g. WebGL) without touching engine/behavior code

### 6.4 web-demo (application)

    * **What**: Glues everything together for a runnable demo
    * **Why**: Keeps only high‑level orchestration here; uses Vite for HMR and a simple entrypoint
    * **File**: `apps/web-demo/src/main.ts` (similar to current `src/main.js`, but far leaner)

-------------------------------------------------------------------------------------------------------------------------------

## 7. Testing Strategy

┌───────────────────┬─────────────────────────────────┬────────────────────┐
│ Layer             │ Testing style                   │ Example tools      │
├───────────────────┼─────────────────────────────────┼────────────────────┤
│ behavior-library  │ Pure unit tests                 │ Jest / Vitest      │
├───────────────────┼─────────────────────────────────┼────────────────────┤
│ simulation-engine │ Unit + property‑based tests     │ Jest + fast-check  │
├───────────────────┼─────────────────────────────────┼────────────────────┤
│ ui-renderer       │ Snapshot + jsdom (canvas mocks) │ Jest + canvas-test │
├───────────────────┼─────────────────────────────────┼────────────────────┤
│ web-demo          │ E2E smoke tests (playwright?)   │ Playwright (opt.)  │
└───────────────────┴─────────────────────────────────┴────────────────────┘

    * **Keep tests co‑located** under each package in `tests/`.
    * **Mock Canvas** via `canvas` or `jest-canvas-mock` to test rendering logic.
    * **CI** runs lint → typecheck → test on each PR.

-------------------------------------------------------------------------------------------------------------------------------

## 8. Documentation & Onboarding

┌─────────────────────────────┬────────────────────────────────────────────────┐
│ Doc                         │ Contents                                       │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ docs/architecture.md        │ High‑level layered diagram & design rationale  │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ docs/module-overview.md     │ Responsibilities + API surface of each package │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ behavior-library/README.md  │ How to add a new cell/behavior                 │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ simulation-engine/README.md │ How update loop works & scan ordering          │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ ui-renderer/README.md       │ UI controls & theming                          │
├─────────────────────────────┼────────────────────────────────────────────────┤
│ apps/web-demo/README.md     │ How to run the demo                            │
└─────────────────────────────┴────────────────────────────────────────────────┘

Automate generation of API docs from TypeScript using typedoc.

Make a README.md for the top-level directory as well.

-------------------------------------------------------------------------------------------------------------------------------

## 9. Build, Dev & Release Workflow

    * **Dev Mode** (`apps/web-demo`):      cd apps/web-demo
          npm install
          npm run dev    # launches Vite with HMR
    * **Build Packages** (root workspace):      npm run build  # builds all packages via workspace scripts
    * **Test** (root workspace):      npm test       # runs tests in all packages
    * **Release** via conventional‑commits & semantic‑release or `changesets` for automated version bumps across packages.

-------------------------------------------------------------------------------------------------------------------------------

## 10. Migration Roadmap

A phased approach minimizes risk:

┌───────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase │ Goals                                                                                                                  │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1     │ Bootstrapping: Set up monorepo, TypeScript configs, shared lint/format, Yarn workspaces. Create empty package folders. │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2     │ behavior‑library: Port all src/cells/… & behaviors/… into TS, export same API surface. Add unit tests.                 │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3     │ simulation‑engine: Port scheduler.js, grid logic, update loop. Write isolated tests (no DOM).                          │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4     │ ui‑renderer: Port renderer.js, ui.js, input.js. Mock canvas tests.                                                     │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5     │ web‑demo: Create apps/web-demo that composes engine + behaviors + UI. Replace Python livereload with Vite.             │
├───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 6     │ Cleanup & Docs: Update docs, remove legacy src/… & scripts/serve.py, retire rollup/jest configs, finalize README.      │
└───────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-------------------------------------------------------------------------------------------------------------------------------

## Conclusion

This proposal defines a clear separation of concerns—splitting physics rules, the simulation core, and the UI—while adopting
TypeScript, modern tooling, and a workspace‑based monorepo layout.  The result will be a codebase that is:

    * **Easier to reason about** (small, focused packages)
    * **Faster to iterate on** (HMR, strong typing)
    * **Safer to extend** (unit tests & contract boundaries)