import { LAVA, AIR, PLANT, WOOD, OIL, FIRE, CINDER } from '../ids';
import { createFluid } from '../behaviors/movement';
import { createNeighborTrigger } from '../behaviors/interaction';
import { createSpawn } from '../behaviors/combustion';
const LAVA_IGNITE_PROB = 1;
const LAVA_CINDER_PROB = 0.02;
const Lava = {
    id: LAVA,
    name: 'Lava',
    color: (_x, _y) => '#e74c3c',
    priority: 2,
    behaviors: [
        createFluid({ allowed: [AIR] }),
        createNeighborTrigger({
            triggerCells: [PLANT, WOOD, OIL],
            result: FIRE,
            prob: LAVA_IGNITE_PROB,
        }),
        createSpawn({ target: () => CINDER, prob: LAVA_CINDER_PROB }),
    ],
};
export default Lava;
