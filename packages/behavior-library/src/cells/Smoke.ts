import { SMOKE, AIR } from '../ids'
import { createRandomTransform } from '../behaviors/interaction'
import { createGas } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const SMOKE_DECAY_PROB = 0.02

const Smoke: CellConfig = {
  id: SMOKE,
  name: 'Smoke',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x * 0.5, y * 0.5 + t / 1000)
    const v = Math.floor(190 + 30 * n)
    return `rgb(${v},${v},${v})`
  },
  priority: 5,
  behaviors: [
    createRandomTransform({ target: AIR, prob: SMOKE_DECAY_PROB }),
    createGas({ allowed: [AIR] }),
  ],
}

export default Smoke
