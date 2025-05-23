import { AIR } from '../ids';
import type { CellConfig } from '../Cell';

const Air: CellConfig = {
  id: AIR,
  name: 'Air',
  color: (x, y) => '#222',
  priority: 0,
  behaviors: [],
};

export default Air;