import { CINDER, AIR, PLANT, WOOD, OIL, FIRE } from '../ids';
import { createRandomTransform, createNeighborTrigger, } from '../behaviors/interaction';
import { createGas } from '../behaviors/movement';
const CINDER_DECAY_PROB = 0.05;
const Cinder = {
    id: CINDER,
    name: 'Cinder',
    color: (_x, _y) => '#f39c12',
    priority: 5,
    behaviors: [
        createGas({ allowed: [AIR] }),
        createNeighborTrigger({ triggerCells: [PLANT, WOOD, OIL], result: FIRE }),
        createRandomTransform({ target: AIR, prob: CINDER_DECAY_PROB }),
    ],
};
export default Cinder;
