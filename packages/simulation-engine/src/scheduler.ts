import { dims } from './config';

/**
 * Double-buffered scan state controlling the update order.
 */
export interface ScanState {
  /** Process cells left-to-right when true, right-to-left when false */
  scanLeftToRight: boolean;
  /** Process cells bottom-to-top when true, top-to-bottom when false */
  scanBottomToTop: boolean;
  /** Toggle scan directions after each update when true */
  toggleScanDirection: boolean;
}

/**
 * Definition of a cell type for the scheduler: priority and an update method.
 */
export interface CellDefinition {
  /** Higher priority values run later in the update loop */
  priority: number;
  /** Invoked for each cell index matching this definition
   * @param index linear index into the grid
   * @param grid current grid buffer
   * @param newGrid next grid buffer (double-buffered)
   * @param dims grid dimensions
   */
  update(
    index: number,
    grid: Uint8Array,
    newGrid: Uint8Array,
    dims: Dims
  ): void;
}

/**
 * Create an initial scan state for the simulation loop.
 * @param toggleScanDirection if true, directions flip after each frame
 */
export function createScanState(toggleScanDirection = false): ScanState {
  return {
    scanLeftToRight: true,
    scanBottomToTop: true,
    toggleScanDirection,
  };
}

/**
 * Create an empty grid buffer for the given dimensions.
 */
export function createGrid(dims: Dims): Uint8Array {
  return new Uint8Array(dims.width * dims.height);
}

/**
 * Create a pair of empty grids (double-buffered) for the given dimensions.
 */
export function createGrids(dims: Dims): [Uint8Array, Uint8Array] {
  return [createGrid(dims), createGrid(dims)];
}

/**
 * Run one simulation step: copy grid to newGrid, then invoke each cell's update
 * in priority order and scan order, optionally with horizontal jitter.
 * Returns a tuple of [nextGrid, previousGrid] for swapping.
 *
 * @param grid current grid buffer
 * @param newGrid next grid buffer
 * @param cellMap mapping of cell ID to cell definition
 * @param priorities sorted list of priorities to process (ascending)
 * @param horizontalJitter if true, random horizontal offsets per row
 * @param scanState controls scan directions and toggling
 */
export function update(
  grid: Uint8Array,
  newGrid: Uint8Array,
  cellMap: Record<number, CellDefinition>,
  priorities: number[],
  horizontalJitter: boolean,
  scanState: ScanState
): [Uint8Array, Uint8Array] {
  const { width, height } = dims;
  newGrid.set(grid);

  for (const prio of priorities) {
    for (
      let y = scanState.scanBottomToTop ? height - 1 : 0;
      scanState.scanBottomToTop ? y >= 0 : y < height;
      y += scanState.scanBottomToTop ? -1 : 1
    ) {
      const offset = horizontalJitter ? Math.floor(Math.random() * width) : 0;
      for (let dx = 0; dx < width; dx++) {
        let x: number;
        if (horizontalJitter) {
          x = scanState.scanLeftToRight
            ? (offset + dx) % width
            : (offset - dx + width) % width;
        } else if (scanState.scanLeftToRight) {
          x = dx;
        } else {
          x = width - 1 - dx;
        }
        const i = y * width + x;
        const cell = cellMap[grid[i]];
        if (cell.priority === prio) {
          cell.update(i, grid, newGrid, dims);
        }
      }
    }
  }

  if (scanState.toggleScanDirection) {
    scanState.scanLeftToRight = !scanState.scanLeftToRight;
    scanState.scanBottomToTop = !scanState.scanBottomToTop;
  }

  return [newGrid, grid];
}