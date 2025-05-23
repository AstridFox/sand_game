import type { Dims, Behavior } from '../Cell';
/** Randomly transforms this cell into a target cell with given probability. */
export declare function createRandomTransform(opts: {
    target: number;
    prob: number;
}): Behavior;
/**
 * When a neighbor cell matches triggerCells, transforms this cell to result with probability.
 */
export declare function createNeighborTrigger(opts: {
    triggerCells: number[];
    result: number;
    prob?: number;
}): Behavior;
/**
 * Propagates this cell to neighboring positions when a neighbor matches triggerCells.
 */
export declare function createNeighborPropagation(opts: {
    triggerCells: number[];
    prob?: number;
}): Behavior;
/**
 * Schedules an action when a neighbor matches triggerCells.
 */
export declare function createNeighborSchedule(opts: {
    triggerCells: number[];
    result: number;
    action: (x: number, y: number, dims: Dims) => void;
}): Behavior;
//# sourceMappingURL=interaction.d.ts.map