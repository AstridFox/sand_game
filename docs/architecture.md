# Architecture Overview

- **Double-buffered grid**: Two Uint8Array buffers (`grid`, `newGrid`) to avoid in-place update conflicts.
- **Update-scan loop**: Iterates through cell priorities and grid rows/columns with optional jitter and bidirectional toggling.
- **Behavior-driven rules**: Cells define behaviors (movement, fluid, gas, combustion, corrosion, etc.) via factory functions.
- **Modular ES modules**: Core logic split into `config.js`, `input.js`, `scheduler.js`, `renderer.js`, `ui.js`, and `cells/` modules.
- **Live-reload server**: Python `livereload` serves `public/` and watches `src/` for hot-reloading during development.
