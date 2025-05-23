export interface Dims {
  width: number;
  height: number;
}

/** A cell behavior function. Returns true if it performed an action. */
export type Behavior = (
  cell: Cell,
  index: number,
  grid: Uint8Array,
  newGrid: Uint8Array,
  dims: Dims
) => boolean;

/** The configuration object for a cell type. */
export interface CellConfig {
  /** Unique numeric ID for this cell. */
  id: number;
  /** Human-readable name for this cell. */
  name: string;
  /** Color function for rendering this cell. */
  color: (x: number, y: number) => string;
  /** Priority for update ordering; higher values run later. */
  priority?: number;
  /** List of behavior functions to execute each update. */
  behaviors?: Behavior[];
}

/** A cell type with its behavior pipeline. */
export class Cell {
  public readonly id: number;
  public readonly name: string;
  public readonly color: (x: number, y: number) => string;
  public readonly priority: number;
  public readonly behaviors: Behavior[];

  constructor({ id, name, color, priority = 0, behaviors = [] }: CellConfig) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.priority = priority;
    this.behaviors = behaviors;
  }

  /** Run behaviors in sequence until one returns true. */
  update(
    index: number,
    grid: Uint8Array,
    newGrid: Uint8Array,
    dims: Dims
  ): void {
    for (const behavior of this.behaviors) {
      if (behavior(this, index, grid, newGrid, dims)) {
        return;
      }
    }
  }
}