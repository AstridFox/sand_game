import { ROCK } from '../ids';
import type { CellConfig } from '../Cell';

const Rock: CellConfig = {
  id: ROCK,
  name: 'Rock',
  color: (x, y) => '#888888',
  priority: 0,
  behaviors: [],
};

export default Rock;