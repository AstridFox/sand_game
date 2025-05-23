# Simple Falling Sand Game (Monorepo)

This repository is a ground-up rewrite of the Simple Falling Sand Game into a modular, maintainable, and testable codebase. The legacy version is located in `OLD/` for reference.

## Project Layout

```
.
├── docs/                       # High-level design documents
│   ├── architecture.md         # Layered architecture overview
│   └── module-overview.md      # Responsibilities & API surface for each module
├── packages/
│   ├── behavior-library/       # Pure cell behavior rules & factories
│   ├── simulation-engine/      # Grid, scheduler, simulation loop
│   └── ui-renderer/            # Canvas & controls UI layer
├── apps/
│   └── web-demo/               # Browser demo application (Vite + HMR)
├── redesign.md                 # Design proposal and migration roadmap
├── package.json                # Root workspace configuration
└── tsconfig.*                  # Shared TypeScript configuration
```

## Prerequisites

This project uses Yarn workspaces to link packages and apps in a monorepo. Yarn workspaces require Yarn v1.22 (or newer) and Node.js v16 (or newer).

Verify your environment:
```bash
node --version    # v16.0.0 or newer
yarn --version    # v1.22.0 or newer
```

If your Yarn version is older, upgrade it globally:
```bash
npm install -g yarn@latest
```

## Development

### Dev Mode (Web Demo)
```bash
yarn install
yarn workspace web-demo dev
```

### Build Packages
```bash
yarn build
```

### Run Tests
```bash
yarn test
```

## Documentation

See `docs/` for high-level design docs and API overviews.

## Legacy Version

The original implementation can be found under `OLD/`. It is retained here until full migration is complete.