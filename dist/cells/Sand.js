import { SAND, AIR, WATER, ACID, OIL } from '../ids';
import { createFall } from '../behaviors/movement';
const Sand = {
    id: SAND,
    name: 'Sand',
    color: (x, y) => '#c2b280',
    priority: 1,
    behaviors: [createFall({ allowed: [AIR, WATER, ACID, OIL] })],
};
export default Sand;
