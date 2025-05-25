import { AIR } from '../ids'
import type { CellConfig } from '../Cell'

const Air: CellConfig = {
  id: AIR,
  name: 'Air',
  color: (_x, _y) => '#222',
  priority: 0,
  behaviors: [],
}

export default Air
