import { ASH, AIR, WATER, SMOKE } from '../ids';
import { createFall } from '../behaviors/movement';
const Ash = {
    id: ASH,
    name: 'Ash',
    color: (_x, _y) => '#95a5a6',
    priority: 1,
    behaviors: [createFall({ allowed: [AIR, WATER, SMOKE] })],
};
export default Ash;
