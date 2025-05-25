import { ACID, AIR, FIRE, SAND, ROCK, PLANT, ASH, WOOD } from '../ids';
import { createCorrode } from '../behaviors/corrosion';
import { createFluid } from '../behaviors/movement';
const ACID_SPREAD_PROB = 0.02;
const Acid = {
    id: ACID,
    name: 'Acid',
    color: (_x, _y) => '#00FF00',
    priority: 2,
    behaviors: [
        createCorrode({
            skip: [AIR, FIRE, SAND],
            solidTargets: [SAND, ROCK, PLANT, ASH, WOOD],
            spreadProb: ACID_SPREAD_PROB,
        }),
        createFluid({ allowed: [AIR] }),
    ],
};
export default Acid;
