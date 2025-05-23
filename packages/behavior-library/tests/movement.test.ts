import { fall, fluid, gas, createFall, createFluid, createGas } from '../src/behaviors/movement';
import type { Dims } from '../src/Cell';
import { AIR, SAND, WATER } from '../src/ids';

describe('movement behaviors', () => {
  const dims: Dims = { width: 3, height: 3 };
  let grid: Uint8Array;
  let newGrid: Uint8Array;

  beforeEach(() => {
    grid = new Uint8Array(dims.width * dims.height);
    newGrid = new Uint8Array(grid);
  });

  test('fall moves particle down if allowed', () => {
    const index = 1;
    grid[index] = SAND;
    newGrid.set(grid);
    const moved = fall(index, grid, newGrid, dims, [AIR]);
    expect(moved).toBe(true);
    expect(newGrid[index + dims.width]).toBe(SAND);
  });

  test('createFall behaves like fall', () => {
    const behavior = createFall({ allowed: [AIR] });
    const index = 1;
    grid[index] = SAND;
    newGrid.set(grid);
    const moved = behavior({} as any, index, grid, newGrid, dims);
    expect(moved).toBe(true);
    expect(newGrid[index + dims.width]).toBe(SAND);
  });

  test('fluid moves particle sideways when down blocked', () => {
    const index = 1;
    grid.fill(AIR);
    newGrid.set(grid);
    grid[index] = WATER;
    newGrid.set(grid);
    // block down
    newGrid[index + dims.width] = SAND;
    const moved = fluid(index, grid, newGrid, dims, [AIR]);
    expect(moved).toBe(true);
    const leftMoved = newGrid[index - 1] === WATER || newGrid[index + 1] === WATER;
    expect(leftMoved).toBe(true);
  });

  test('gas moves particle up if allowed', () => {
    const index = 4; // center
    grid.fill(AIR);
    newGrid.set(grid);
    grid[index] = SAND;
    newGrid.set(grid);
    const moved = gas(index, grid, newGrid, dims, [AIR]);
    expect(moved).toBe(true);
    expect(newGrid[index - dims.width]).toBe(SAND);
  });

  test('createFluid and createGas wrappers', () => {
    const fluidBehavior = createFluid({ allowed: [AIR] });
    const gasBehavior = createGas({ allowed: [AIR] });
    const idx = 4;
    grid[idx] = WATER;
    newGrid.set(grid);
    expect(fluidBehavior({} as any, idx, grid, newGrid, dims)).toBe(true);
    grid[idx] = SAND;
    newGrid.set(grid);
    expect(gasBehavior({} as any, idx, grid, newGrid, dims)).toBe(true);
  });
});