import { Cell } from './Cell';
import type { Behavior, Dims } from './Cell';
import * as ids from './ids';
import * as movement from './behaviors/movement';
import * as combustion from './behaviors/combustion';
import * as corrosion from './behaviors/corrosion';
import * as growth from './behaviors/growth';
import * as interaction from './behaviors/interaction';
import * as utils from './behaviors/utils';
/** Registry of all cell types for lookup by ID or name. */
export declare class CellRegistry {
    private byId;
    private byName;
    constructor(cells: Cell[]);
    /** Lookup a cell by its numeric ID. */
    getById(id: number): Cell | undefined;
    /** Lookup a cell by its string name. */
    getByName(name: string): Cell | undefined;
    /** Get all registered cells in definition order. */
    getAll(): Cell[];
}
/** Array of all cell instances. */
export declare const cells: Cell[];
/** Singleton cell registry. */
export declare const registry: CellRegistry;
export { ids, movement, combustion, corrosion, growth, interaction, utils };
export type { Cell, Behavior, Dims };
export default registry;
//# sourceMappingURL=index.d.ts.map