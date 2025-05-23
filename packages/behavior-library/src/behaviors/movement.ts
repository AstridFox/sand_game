import type { Dims } from '../Cell';

/** Attempts to move a cell down or diagonally down if the target is allowed. */
export function fall(
  index: number,
  grid: Uint8Array,
  newGrid: Uint8Array,
  dims: Dims,
  allowed: number[]
): boolean {
  const { width, height } = dims;
  const y = Math.floor(index / width);
  const x = index % width;
  if (y < height - 1) {
    const below = index + width;
    const target = newGrid[below];
    if (allowed.includes(target)) {
      newGrid[below] = grid[index];
      newGrid[index] = target;
      return true;
    }
  }
  const dir = Math.random() < 0.5 ? -1 : 1;
  const diag = index + width + dir;
  if (
    y < height - 1 &&
    x + dir >= 0 &&
    x + dir < width &&
    allowed.includes(newGrid[diag])
  ) {
    const target = newGrid[diag];
    newGrid[diag] = grid[index];
    newGrid[index] = target;
    return true;
  }
  return false;
}

/** Attempts to move a cell like a fluid, downward or sideways if the target is allowed. */
export function fluid(
  index: number,
  grid: Uint8Array,
  newGrid: Uint8Array,
  dims: Dims,
  allowed: number[]
): boolean {
  const { width, height } = dims;
  const y = Math.floor(index / width);
  const x = index % width;
  if (y < height - 1) {
    const below = index + width;
    const targetBelow = newGrid[below];
    if (allowed.includes(targetBelow)) {
      newGrid[below] = grid[index];
      newGrid[index] = targetBelow;
      return true;
    }
  }
  const dir = Math.random() < 0.5 ? -1 : 1;
  const diag = index + width + dir;
  if (
    y < height - 1 &&
    x + dir >= 0 &&
    x + dir < width &&
    allowed.includes(newGrid[diag])
  ) {
    const target = newGrid[diag];
    newGrid[diag] = grid[index];
    newGrid[index] = target;
    return true;
  }
  const otherDiag = index + width - dir;
  if (
    y < height - 1 &&
    x - dir >= 0 &&
    x - dir < width &&
    allowed.includes(newGrid[otherDiag])
  ) {
    const target = newGrid[otherDiag];
    newGrid[otherDiag] = grid[index];
    newGrid[index] = target;
    return true;
  }
  const left = index - 1;
  const right = index + 1;
  const canLeft = x > 0 && allowed.includes(newGrid[left]);
  const canRight = x < width - 1 && allowed.includes(newGrid[right]);
  if (canLeft && canRight) {
    if (Math.random() < 0.5) {
      const target = newGrid[left];
      newGrid[left] = grid[index];
      newGrid[index] = target;
    } else {
      const target = newGrid[right];
      newGrid[right] = grid[index];
      newGrid[index] = target;
    }
    return true;
  }
  if (canLeft) {
    const target = newGrid[left];
    newGrid[left] = grid[index];
    newGrid[index] = target;
    return true;
  }
  if (canRight) {
    const target = newGrid[right];
    newGrid[right] = grid[index];
    newGrid[index] = target;
    return true;
  }
  return false;
}

/** Attempts to move a cell like a gas, upward or sideways if the target is allowed. */
export function gas(
  index: number,
  grid: Uint8Array,
  newGrid: Uint8Array,
  dims: Dims,
  allowed: number[]
): boolean {
  const { width, height } = dims;
  const y = Math.floor(index / width);
  const x = index % width;
  if (y > 0) {
    const above = index - width;
    const targetAbove = newGrid[above];
    if (allowed.includes(targetAbove)) {
      newGrid[above] = grid[index];
      newGrid[index] = targetAbove;
      return true;
    }
  }
  const dir = Math.random() < 0.5 ? -1 : 1;
  const diag = index - width + dir;
  if (
    y > 0 &&
    x + dir >= 0 &&
    x + dir < width &&
    allowed.includes(newGrid[diag])
  ) {
    const target = newGrid[diag];
    newGrid[diag] = grid[index];
    newGrid[index] = target;
    return true;
  }
  const left = index - 1;
  const right = index + 1;
  const canLeft = x > 0 && allowed.includes(newGrid[left]);
  const canRight = x < width - 1 && allowed.includes(newGrid[right]);
  if (canLeft && canRight) {
    if (Math.random() < 0.5) {
      const target = newGrid[left];
      newGrid[left] = grid[index];
      newGrid[index] = target;
    } else {
      const target = newGrid[right];
      newGrid[right] = grid[index];
      newGrid[index] = target;
    }
    return true;
  }
  if (canLeft) {
    const target = newGrid[left];
    newGrid[left] = grid[index];
    newGrid[index] = target;
    return true;
  }
  if (canRight) {
    const target = newGrid[right];
    newGrid[right] = grid[index];
    newGrid[index] = target;
    return true;
  }
  return false;
}

/** Factory for fall behavior. */
export function createFall(opts: { allowed: number[] }) {
  return (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) =>
    fall(index, grid, newGrid, dims, opts.allowed);
}

/** Factory for fluid behavior. */
export function createFluid(opts: { allowed: number[] }) {
  return (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) =>
    fluid(index, grid, newGrid, dims, opts.allowed);
}

/** Factory for gas behavior. */
export function createGas(opts: { allowed: number[] }) {
  return (cell: any, index: number, grid: Uint8Array, newGrid: Uint8Array, dims: Dims) =>
    gas(index, grid, newGrid, dims, opts.allowed);
}