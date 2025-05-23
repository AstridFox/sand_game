import { WOOD } from '../ids';
import type { CellConfig } from '../Cell';

const Wood: CellConfig = {
  id: WOOD,
  name: 'Wood',
  color: (x, y) => '#a0522d',
  priority: 0,
  behaviors: [],
};

export default Wood;