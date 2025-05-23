import type { Dims } from '../Cell';
/**
 * Schedule a procedural tree growth starting at (startX, startY).
 * Enqueues tasks to convert cells into wood and plant over subsequent frames.
 */
export declare function scheduleTree(startX: number, startY: number, dims: Dims): void;
/**
 * Process one step of all pending tree growth tasks, modifying the grid in place.
 */
export declare function processGrowth(grid: Uint8Array, dims: Dims): void;
export default scheduleTree;
//# sourceMappingURL=growth.d.ts.map