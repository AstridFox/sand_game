import { PLANT, WATER, WOOD } from '../ids';
import { createRandomTransform, createNeighborPropagation, } from '../behaviors/interaction';
const GROWTH_PROBABILITY = 0.2;
const PLANT_TO_WOOD_PROBABILITY = 0.001;
const Plant = {
    id: PLANT,
    name: 'Plant',
    color: (_x, _y) => '#2ecc71',
    priority: 3,
    behaviors: [
        createRandomTransform({ target: WOOD, prob: PLANT_TO_WOOD_PROBABILITY }),
        createNeighborPropagation({
            triggerCells: [WATER],
            prob: GROWTH_PROBABILITY,
        }),
    ],
};
export default Plant;
