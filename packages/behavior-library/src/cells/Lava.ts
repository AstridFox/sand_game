import { LAVA, AIR, PLANT, WOOD, OIL, FIRE, CINDER } from '../ids'
import { createFluid } from '../behaviors/movement'
import { createNeighborTrigger } from '../behaviors/interaction'
import { createSpawn } from '../behaviors/combustion'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const LAVA_IGNITE_PROB = 1
const LAVA_CINDER_PROB = 0.02

const Lava: CellConfig = {
  id: LAVA,
  name: 'Lava',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x * 0.2, y * 0.2 + t / 300)
    const r = Math.floor(231 + 24 * n)
    const g = Math.floor(76 + 30 * n)
    const b = Math.floor(60 + 10 * n)
    return `rgb(${r},${g},${b})`
  },
  priority: 2,
  behaviors: [
    createFluid({ allowed: [AIR] }),
    createNeighborTrigger({
      triggerCells: [PLANT, WOOD, OIL],
      result: FIRE,
      prob: LAVA_IGNITE_PROB,
    }),
    createSpawn({ target: () => CINDER, prob: LAVA_CINDER_PROB }),
  ],
}

export default Lava
