import { SAND, AIR, WATER, ACID, OIL } from '../ids'
import { createFall } from '../behaviors/movement'
import type { CellConfig } from '../Cell'

const Sand: CellConfig = {
  id: SAND,
  name: 'Sand',
  color: (_x, _y) => '#c2b280',
  priority: 1,
  behaviors: [createFall({ allowed: [AIR, WATER, ACID, OIL] })],
}

export default Sand
