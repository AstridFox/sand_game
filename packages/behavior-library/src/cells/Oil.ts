import { OIL, FIRE, AIR } from '../ids'
import { createNeighborTrigger } from '../behaviors/interaction'
import { createFluid } from '../behaviors/movement'
import type { CellConfig } from '../Cell'

const OIL_FIRE_SPREAD_PROB = 0.02

const Oil: CellConfig = {
  id: OIL,
  name: 'Oil',
  color: (_x, _y) => '#333300',
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
