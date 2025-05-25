import { ASH, AIR, WATER, SMOKE } from '../ids'
import { createFall } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const Ash: CellConfig = {
  id: ASH,
  name: 'Ash',
  color: (x, y, _t) => {
    const n = noise(x, y)
    const brightness = 0.7 + 0.3 * n
    const shade = Math.floor(149 * brightness)
    return `rgb(${shade},${shade},${shade})`
  },
  priority: 1,
  behaviors: [createFall({ allowed: [AIR, WATER, SMOKE] })],
}

export default Ash
