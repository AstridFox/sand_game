import { SEED, WATER, WOOD } from '../ids'
import scheduleTree from '../behaviors/growth'
import { noise } from '../behaviors/utils'
import { createNeighborSchedule } from '../behaviors/interaction'
import type { CellConfig } from '../Cell'

const Seed: CellConfig = {
  id: SEED,
  name: 'Seed',
  color: (x, y) => {
    const n = noise(x, y)
    const r = Math.floor(139 * (0.8 + 0.4 * n))
    const g = Math.floor(69 * (0.8 + 0.4 * n))
    const b = Math.floor(19 * (0.8 + 0.4 * n))
    return `rgb(${r},${g},${b})`
  },
  priority: 3,
  behaviors: [
    createNeighborSchedule({
      triggerCells: [WATER],
      result: WOOD,
      action: scheduleTree,
    }),
  ],
}

export default Seed
