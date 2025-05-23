import type { Dims } from '../Cell';
/** Attempts to move a cell down or diagonally down if the target is allowed. */
export declare function fall(index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims, allowed: number[]): boolean;
/** Attempts to move a cell like a fluid, downward or sideways if the target is allowed. */
export declare function fluid(index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims, allowed: number[]): boolean;
/** Attempts to move a cell like a gas, upward or sideways if the target is allowed. */
export declare function gas(index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims, allowed: number[]): boolean;
/** Factory for fall behavior. */
export declare function createFall(opts: {
    allowed: number[];
}): (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) => boolean;
/** Factory for fluid behavior. */
export declare function createFluid(opts: {
    allowed: number[];
}): (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) => boolean;
/** Factory for gas behavior. */
export declare function createGas(opts: {
    allowed: number[];
}): (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) => boolean;
//# sourceMappingURL=movement.d.ts.map