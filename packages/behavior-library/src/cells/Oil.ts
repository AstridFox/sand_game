import { OIL, FIRE, AIR } from '../ids'
import { createNeighborTrigger } from '../behaviors/interaction'
import { createFluid } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const OIL_FIRE_SPREAD_PROB = 0.02

const Oil: CellConfig = {
  id: OIL,
  name: 'Oil',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x, y)
    const sheen = Math.sin((x + y) / 10 + t / 500)
    const c = Math.floor(30 + 20 * n + 10 * sheen)
    return `rgb(${c},${c},${Math.floor(c / 4)})`
  },
  priority: 2,
  behaviors: [
    createNeighborTrigger({
      triggerCells: [FIRE],
      result: FIRE,
      prob: OIL_FIRE_SPREAD_PROB,
    }),
    createFluid({ allowed: [AIR] }),
  ],
}

export default Oil
