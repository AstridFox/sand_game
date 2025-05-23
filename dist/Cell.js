/** A cell type with its behavior pipeline. */
export class Cell {
    constructor({ id, name, color, priority = 0, behaviors = [] }) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.priority = priority;
        this.behaviors = behaviors;
    }
    /** Run behaviors in sequence until one returns true. */
    update(index, grid, newGrid, dims) {
        for (const behavior of this.behaviors) {
            if (behavior(this, index, grid, newGrid, dims)) {
                return;
            }
        }
    }
}
