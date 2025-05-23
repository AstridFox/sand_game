export interface Dims {
    width: number;
    height: number;
}
/** A cell behavior function. Returns true if it performed an action. */
export type Behavior = (cell: Cell, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) => boolean;
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
export declare class Cell {
    readonly id: number;
    readonly name: string;
    readonly color: (x: number, y: number) => string;
    readonly priority: number;
    readonly behaviors: Behavior[];
    constructor({ id, name, color, priority, behaviors }: CellConfig);
    /** Run behaviors in sequence until one returns true. */
    update(index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims): void;
}
//# sourceMappingURL=Cell.d.ts.map