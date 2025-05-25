import { CINDER, AIR, PLANT, WOOD, OIL, FIRE } from '../ids'
import {
  createRandomTransform,
  createNeighborTrigger,
} from '../behaviors/interaction'
import { createGas } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const CINDER_DECAY_PROB = 0.05

const Cinder: CellConfig = {
  id: CINDER,
  name: 'Cinder',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x, y)
    const flicker = 0.8 + 0.2 * Math.sin(t / 200 + n * 10)
    const r = Math.floor(243 * flicker)
    const g = Math.floor(156 * flicker)
    const b = Math.floor(18 * flicker)
    return `rgb(${r},${g},${b})`
  },
  priority: 5,
  behaviors: [
    createGas({ allowed: [AIR] }),
    createNeighborTrigger({ triggerCells: [PLANT, WOOD, OIL], result: FIRE }),
    createRandomTransform({ target: AIR, prob: CINDER_DECAY_PROB }),
  ],
}

export default Cinder
