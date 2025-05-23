import scheduleTree, { processGrowth } from '../src/behaviors/growth';
import type { Dims } from '../src/Cell';
import { WOOD } from '../src/ids';

describe('growth behavior', () => {
  test('scheduleTree and processGrowth produce wood cells', () => {
    const dims: Dims = { width: 5, height: 5 };
    const grid = new Uint8Array(dims.width * dims.height).fill(0);
    scheduleTree(2, 4, dims);
    processGrowth(grid, dims);
    // At least one wood cell should be placed
    const produced = Array.from(grid).some(val => val === WOOD);
    expect(produced).toBe(true);
  });
});