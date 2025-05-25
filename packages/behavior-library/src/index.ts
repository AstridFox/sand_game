import { Cell } from './Cell'
import type { Behavior, Dims } from './Cell'
import * as ids from './ids'

import * as movement from './behaviors/movement'
import * as combustion from './behaviors/combustion'
import * as corrosion from './behaviors/corrosion'
import * as growth from './behaviors/growth'
import * as interaction from './behaviors/interaction'
import * as utils from './behaviors/utils'

import Air from './cells/Air'
import Sand from './cells/Sand'
import Water from './cells/Water'
import Rock from './cells/Rock'
import Plant from './cells/Plant'
import Fire from './cells/Fire'
import Ash from './cells/Ash'
import Smoke from './cells/Smoke'
import Wood from './cells/Wood'
import Oil from './cells/Oil'
import Acid from './cells/Acid'
import Seed from './cells/Seed'
import Cinder from './cells/Cinder'
import Lava from './cells/Lava'

/** Registry of all cell types for lookup by ID or name. */
export class CellRegistry {
  private byId = new Map<number, Cell>()
  private byName = new Map<string, Cell>()

  constructor(cells: Cell[]) {
    for (const cell of cells) {
      this.byId.set(cell.id, cell)
      this.byName.set(cell.name, cell)
    }
  }

  /** Lookup a cell by its numeric ID. */
  getById(id: number): Cell | undefined {
    return this.byId.get(id)
  }

  /** Lookup a cell by its string name. */
  getByName(name: string): Cell | undefined {
    return this.byName.get(name)
  }

  /** Get all registered cells in definition order. */
  getAll(): Cell[] {
    return Array.from(this.byId.values())
  }
}

const configs = [
  Air,
  Sand,
  Water,
  Rock,
  Plant,
  Fire,
  Ash,
  Smoke,
  Wood,
  Oil,
  Acid,
  Seed,
  Cinder,
  Lava,
]

/** Array of all cell instances. */
export const cells: Cell[] = configs.map((cfg) => new Cell(cfg))

/** Singleton cell registry. */
export const registry = new CellRegistry(cells)

export { ids, movement, combustion, corrosion, growth, interaction, utils }
export type { Cell, Behavior, Dims }
export default registry
