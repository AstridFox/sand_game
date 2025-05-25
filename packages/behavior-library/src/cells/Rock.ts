import { ROCK } from '../ids'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const Rock: CellConfig = {
  id: ROCK,
  name: 'Rock',
  color: (x, y, _t) => {
    const n = noise(x, y)
    const shade = Math.floor(136 * (0.6 + 0.4 * n))
    return `rgb(${shade},${shade},${shade})`
  },
  priority: 0,
  behaviors: [],
}

export default Rock
