import { AIR } from '../ids'
import type { CellConfig } from '../Cell'

const Air: CellConfig = {
  id: AIR,
  name: 'Air',
  color: (_x, _y, _t) => 'rgba(200,200,200,0.1)',
  priority: 0,
  behaviors: [],
}

export default Air
