import { SAND, AIR, WATER, ACID, OIL } from '../ids'
import { createFall } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const Sand: CellConfig = {
  id: SAND,
  name: 'Sand',
  color: (x, y, _t) => {
    const n = noise(x, y)
    const brightness = 0.8 + 0.2 * n
    const r = Math.floor(194 * brightness)
    const g = Math.floor(178 * brightness)
    const b = Math.floor(128 * brightness)
    return `rgb(${r},${g},${b})`
  },
  priority: 1,
  behaviors: [createFall({ allowed: [AIR, WATER, ACID, OIL] })],
}

export default Sand
