import type { Behavior } from '../Cell';
/** Spread a cell type to adjacent target cells with a given probability. */
export declare function createSpread(opts: {
    targets: number[];
    prob: number;
}): Behavior;
/** Produce smoke above the cell with a given probability. */
export declare function createSmoke(opts: {
    prob: number;
}): Behavior;
/** Possibly extinguish the cell, turning into ash or air based on neighbors. */
export declare function createExtinguish(opts: {
    deathProb: number;
    ashThreshold: number;
}): Behavior;
/** Possibly spawn a given target cell or result of factory at this position. */
export declare function createSpawn(opts: {
    target: number | (() => number);
    prob: number;
}): Behavior;
//# sourceMappingURL=combustion.d.ts.map