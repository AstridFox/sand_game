import { SEED, WATER, WOOD } from '../ids'
import scheduleTree from '../behaviors/growth'
import { noise } from '../behaviors/utils'
import { createNeighborSchedule } from '../behaviors/interaction'
import type { CellConfig } from '../Cell'

const Seed: CellConfig = {
  id: SEED,
  name: 'Seed',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x, y)
    const base = 0.8 + 0.4 * n
    const pulse = 0.9 + 0.1 * Math.sin(t / 1000 + n * 10)
    const r = Math.floor(139 * base * pulse)
    const g = Math.floor(69 * base * pulse)
    const b = Math.floor(19 * base * pulse)
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
