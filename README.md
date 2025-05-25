# simple-falling-sand-game

Monorepo for a simple falling sand simulation game, composed of reusable packages and a web-based demo.

## Overview

This repository contains the following workspaces:

- **behavior-library**: Cell type definitions and behavior pipelines for the simulation.
- **simulation-engine**: Double-buffered grid and scheduler loop engine.
- **ui-renderer**: Canvas rendering and UI controls.
- **web-demo**: Demo application combining the packages in a browser.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 14.0.0
- [Yarn](https://yarnpkg.com/) >= 1.22.0

## Installation

```bash
# Clone the repository
git clone https://github.com/<username>/simple-falling-sand-game.git
cd simple-falling-sand-game

# Install all dependencies
yarn install
```

## Development

### Building

Compile all workspaces:

```bash
yarn build
```

This runs the `build` script in each workspace to compile TypeScript and generate the distribution bundles.

### Running Tests

```bash
yarn test
```

### Linting and Formatting

```bash
yarn lint
yarn lintfix
yarn format
```

## Running the Demo

Start the web demo in development mode:

```bash
yarn workspace web-demo dev
```

Open the local URL (e.g., http://localhost:5173) printed in the terminal to view the simulation.

To build and preview the production bundle:

```bash
yarn build
yarn workspace web-demo preview
```

## Package Usage

For details on using the core packages in your own projects, see the individual package READMEs:

- [`packages/behavior-library/README.md`](packages/behavior-library/README.md)
- [`packages/simulation-engine/README.md`](packages/simulation-engine/README.md)
- [`packages/ui-renderer/README.md`](packages/ui-renderer/README.md)

## Contributing

Contributions are welcome! Please open issues and pull requests for bug fixes and new features.

## License

This project is currently unlicensed.
