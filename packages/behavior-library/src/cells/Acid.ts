import { ACID, AIR, FIRE, SAND, ROCK, PLANT, ASH, WOOD } from '../ids'
import { createCorrode } from '../behaviors/corrosion'
import { createFluid } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const ACID_SPREAD_PROB = 0.02

const Acid: CellConfig = {
  id: ACID,
  name: 'Acid',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x * 0.5, y * 0.5 + t / 1000)
    const r = Math.floor(50 * n)
    const g = Math.floor(200 + 55 * n)
    const b = Math.floor(20 * n)
    return `rgb(${r},${g},${b})`
  },
  priority: 2,
  behaviors: [
    createCorrode({
      skip: [AIR, FIRE, SAND],
      solidTargets: [SAND, ROCK, PLANT, ASH, WOOD],
      spreadProb: ACID_SPREAD_PROB,
    }),
    createFluid({ allowed: [AIR] }),
  ],
}

export default Acid
