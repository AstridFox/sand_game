import { WOOD } from '../ids'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const Wood: CellConfig = {
  id: WOOD,
  name: 'Wood',
  color: (x, y, _t) => {
    const n = noise(x, y)
    const r = Math.floor(160 + 30 * n)
    const g = Math.floor(82 + 20 * n)
    const b = Math.floor(45 + 10 * n)
    return `rgb(${r},${g},${b})`
  },
  priority: 0,
  behaviors: [],
}

export default Wood
