import { ASH, AIR, WATER, SMOKE } from '../ids';
import { createFall } from '../behaviors/movement';
import type { CellConfig } from '../Cell';

const Ash: CellConfig = {
  id: ASH,
  name: 'Ash',
  color: (x, y) => '#95a5a6',
  priority: 1,
  behaviors: [createFall({ allowed: [AIR, WATER, SMOKE] })],
};

export default Ash;