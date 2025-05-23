import { WATER, AIR } from '../ids';
import { createFluid } from '../behaviors/movement';
import type { CellConfig } from '../Cell';

const Water: CellConfig = {
  id: WATER,
  name: 'Water',
  color: (x, y) => {
    const t = performance.now();
    const g = 152 + 20 * Math.sin((x + y) / 5 + t / 500);
    return `rgb(52,${Math.floor(g)},219)`;
  },
  priority: 2,
  behaviors: [createFluid({ allowed: [AIR] })],
};

export default Water;