import { FIRE, CINDER, PLANT, WOOD, OIL } from '../ids';
import {
  createSpread,
  createSmoke,
  createExtinguish,
  createSpawn,
} from '../behaviors/combustion';
import type { CellConfig } from '../Cell';

const FIRE_SPREAD_PROB = 0.5;
const FIRE_SMOKE_PROB = 0.2;
const FIRE_DEATH_PROB = 0.05;
const FIRE_ASH_NEIGHBOR_THRESHOLD = 1;
const FIRE_CINDER_PROB = 0.1;

const Fire: CellConfig = {
  id: FIRE,
  name: 'Fire',
  color: (x, y) => {
    const r = 200 + Math.random() * 55;
    const g = Math.random() * 100;
    const b = Math.random() * 50;
    return `rgb(${(r | 0)},${(g | 0)},${(b | 0)})`;
  },
  priority: 4,
  behaviors: [
    createSpread({ targets: [PLANT, WOOD, OIL], prob: FIRE_SPREAD_PROB }),
    createSmoke({ prob: FIRE_SMOKE_PROB }),
    createExtinguish({
      deathProb: FIRE_DEATH_PROB,
      ashThreshold: FIRE_ASH_NEIGHBOR_THRESHOLD,
    }),
    createSpawn({ target: CINDER, prob: FIRE_CINDER_PROB }),
  ],
};

export default Fire;