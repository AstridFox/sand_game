/** Randomly transforms this cell into a target cell with given probability. */
export function createRandomTransform(opts) {
    return (_cell, index, _grid, newGrid) => {
        if (Math.random() < opts.prob) {
            newGrid[index] = opts.target;
            return true;
        }
        return false;
    };
}
/**
 * When a neighbor cell matches triggerCells, transforms this cell to result with probability.
 */
export function createNeighborTrigger(opts) {
    return (_cell, index, grid, newGrid, dims) => {
        const { width, height } = dims;
        const y = Math.floor(index / width);
        const x = index % width;
        const neighbors = [];
        if (y > 0)
            neighbors.push(index - width);
        if (y < height - 1)
            neighbors.push(index + width);
        if (x > 0)
            neighbors.push(index - 1);
        if (x < width - 1)
            neighbors.push(index + 1);
        for (const n of neighbors) {
            if (opts.triggerCells.includes(grid[n]) &&
                Math.random() < (opts.prob ?? 1)) {
                newGrid[index] = opts.result;
                return true;
            }
        }
        return false;
    };
}
/**
 * Propagates this cell to neighboring positions when a neighbor matches triggerCells.
 */
export function createNeighborPropagation(opts) {
    return (_cell, index, grid, newGrid, dims) => {
        const { width, height } = dims;
        const y = Math.floor(index / width);
        const x = index % width;
        const neighbors = [];
        if (y > 0)
            neighbors.push(index - width);
        if (y < height - 1)
            neighbors.push(index + width);
        if (x > 0)
            neighbors.push(index - 1);
        if (x < width - 1)
            neighbors.push(index + 1);
        // shuffle neighbors
        for (let j = neighbors.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [neighbors[j], neighbors[k]] = [neighbors[k], neighbors[j]];
        }
        for (const n of neighbors) {
            if (opts.triggerCells.includes(grid[n]) &&
                Math.random() < (opts.prob ?? 1)) {
                newGrid[n] = _cell.id;
                return true;
            }
        }
        return false;
    };
}
/**
 * Schedules an action when a neighbor matches triggerCells.
 */
export function createNeighborSchedule(opts) {
    return (_cell, index, grid, newGrid, dims) => {
        const { width, height } = dims;
        const y = Math.floor(index / width);
        const x = index % width;
        const neighbors = [];
        if (y > 0)
            neighbors.push(index - width);
        if (y < height - 1)
            neighbors.push(index + width);
        if (x > 0)
            neighbors.push(index - 1);
        if (x < width - 1)
            neighbors.push(index + 1);
        for (const n of neighbors) {
            if (opts.triggerCells.includes(grid[n])) {
                newGrid[index] = opts.result;
                opts.action(x, y, dims);
                return true;
            }
        }
        return false;
    };
}
