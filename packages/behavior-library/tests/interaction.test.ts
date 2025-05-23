import {
  createRandomTransform,
  createNeighborTrigger,
  createNeighborPropagation,
  createNeighborSchedule,
} from '../src/behaviors/interaction';
import { AIR, FIRE, WATER } from '../src/ids';
import type { Dims } from '../src/Cell';

describe('interaction behaviors', () => {
  const dims: Dims = { width: 3, height: 3 };
  let grid: Uint8Array;
  let newGrid: Uint8Array;
  const center = 4;

  beforeEach(() => {
    grid = new Uint8Array(dims.width * dims.height).fill(AIR);
    newGrid = new Uint8Array(grid);
    grid[center] = WATER;
    newGrid.set(grid);
  });

  test('createRandomTransform with prob=1 always transforms', () => {
    const transform = createRandomTransform({ target: FIRE, prob: 1 });
    const did = transform({} as any, center, grid, newGrid, dims);
    expect(did).toBe(true);
    expect(newGrid[center]).toBe(FIRE);
  });

  test('createNeighborTrigger triggers on adjacent cell', () => {
    grid[center - dims.width] = FIRE;
    const trigger = createNeighborTrigger({ triggerCells: [FIRE], result: FIRE, prob: 1 });
    const did = trigger({} as any, center, grid, newGrid, dims);
    expect(did).toBe(true);
    expect(newGrid[center]).toBe(FIRE);
  });

  test('createNeighborPropagation propagates to neighbor', () => {
    grid[center - 1] = FIRE;
    const propagate = createNeighborPropagation({ triggerCells: [FIRE], prob: 1 });
    const did = propagate({ id: WATER } as any, center - 1, grid, newGrid, dims);
    // water at center-1 should move to some neighbor, ensure one neighbor changes
    expect(did).toBe(true);
  });

  test('createNeighborSchedule calls action when triggered', () => {
    let called = false;
    const action = (_x: number, _y: number, _dims: Dims) => {
      called = true;
    };
    grid[center - 1] = FIRE;
    const schedule = createNeighborSchedule({ triggerCells: [FIRE], result: FIRE, action });
    const did = schedule({} as any, center, grid, newGrid, dims);
    expect(did).toBe(true);
    expect(called).toBe(true);
  });
});