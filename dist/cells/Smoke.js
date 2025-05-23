import { SMOKE, AIR } from '../ids';
import { createRandomTransform } from '../behaviors/interaction';
import { createGas } from '../behaviors/movement';
const SMOKE_DECAY_PROB = 0.02;
const Smoke = {
    id: SMOKE,
    name: 'Smoke',
    color: (x, y) => '#bdc3c7',
    priority: 5,
    behaviors: [
        createRandomTransform({ target: AIR, prob: SMOKE_DECAY_PROB }),
        createGas({ allowed: [AIR] }),
    ],
};
export default Smoke;
