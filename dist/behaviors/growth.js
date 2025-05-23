import { PLANT, WOOD } from '../ids';
const pendingTrees = [];
/**
 * Schedule a procedural tree growth starting at (startX, startY).
 * Enqueues tasks to convert cells into wood and plant over subsequent frames.
 */
export function scheduleTree(startX, startY, dims) {
    const { width, height } = dims;
    const TRUNK_HEIGHT = 5 + Math.floor(Math.random() * 5);
    const MAX_BRANCH_DEPTH = 3;
    const BRANCH_PROB = 0.3;
    const BRANCH_LEN_MIN = 3;
    const BRANCH_LEN_MAX = 6;
    const tasks = [];
    const trunkPoints = [];
    let x = startX;
    let y = startY;
    for (let i = 0; i < TRUNK_HEIGHT; i++) {
        if (y - 1 < 0)
            break;
        y--;
        trunkPoints.push({ x, y });
        tasks.push({ x, y, id: WOOD });
    }
    const branches = [];
    for (let j = 1; j < trunkPoints.length - 1; j++) {
        if (Math.random() < BRANCH_PROB) {
            const pt = trunkPoints[j];
            const dir = Math.random() < 0.5 ? -1 : 1;
            branches.push({ x: pt.x, y: pt.y, dir, depth: 1 });
        }
    }
    if (trunkPoints.length) {
        const top = trunkPoints[trunkPoints.length - 1];
        branches.push({ x: top.x, y: top.y, dir: -1, depth: 1 });
        branches.push({ x: top.x, y: top.y, dir: 1, depth: 1 });
    }
    while (branches.length > 0) {
        const br = branches.pop();
        const len = BRANCH_LEN_MIN +
            Math.floor(Math.random() * (BRANCH_LEN_MAX - BRANCH_LEN_MIN));
        let bx = br.x;
        let by = br.y;
        for (let i = 0; i < len; i++) {
            bx += br.dir;
            by -= 1;
            if (bx < 0 || bx >= width || by < 0)
                break;
            tasks.push({ x: bx, y: by, id: WOOD });
            if (br.depth < MAX_BRANCH_DEPTH && Math.random() < BRANCH_PROB) {
                const nd = Math.random() < 0.5 ? -1 : 1;
                branches.push({ x: bx, y: by, dir: nd, depth: br.depth + 1 });
            }
        }
        if (bx >= 0 && bx < width && by >= 0 && by < height) {
            tasks.push({ x: bx, y: by, id: PLANT });
        }
    }
    pendingTrees.push({ tasks, index: 0 });
}
/**
 * Process one step of all pending tree growth tasks, modifying the grid in place.
 */
export function processGrowth(grid, dims) {
    for (let t = pendingTrees.length - 1; t >= 0; t--) {
        const tree = pendingTrees[t];
        if (tree.index < tree.tasks.length) {
            const task = tree.tasks[tree.index++];
            const pos = task.y * dims.width + task.x;
            grid[pos] = task.id;
        }
        else {
            pendingTrees.splice(t, 1);
        }
    }
}
export default scheduleTree;
