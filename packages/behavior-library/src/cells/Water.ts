import { WATER, AIR } from '../ids'
import { createFluid } from '../behaviors/movement'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const Water: CellConfig = {
  id: WATER,
  name: 'Water',
  color: (x, y, _t) => {
    const t = performance.now()
    const wave = Math.sin((x + y) / 5 + t / 500)
    const ripple = Math.cos((x - y) / 7 + t / 300)
    const g = 152 + 20 * wave
    const b = 200 + 19 * ripple
    const n = noise(x, y)
    const r = Math.floor(50 + 10 * n)
    return `rgb(${r},${Math.floor(g)},${Math.floor(b)})`
  },
  priority: 2,
  behaviors: [createFluid({ allowed: [AIR] })],
}

export default Water
