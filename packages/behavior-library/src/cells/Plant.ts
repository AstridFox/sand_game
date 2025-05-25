import { PLANT, WATER, WOOD } from '../ids'
import {
  createRandomTransform,
  createNeighborPropagation,
} from '../behaviors/interaction'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const GROWTH_PROBABILITY = 0.2
const PLANT_TO_WOOD_PROBABILITY = 0.001

const Plant: CellConfig = {
  id: PLANT,
  name: 'Plant',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x, y)
    const brightness = 0.9 + 0.1 * Math.sin(t / 800 + n * 10)
    const r = Math.floor(46 * brightness)
    const g = Math.floor(204 * brightness)
    const b = Math.floor(113 * brightness)
    return `rgb(${r},${g},${b})`
  },
  priority: 3,
  behaviors: [
    createRandomTransform({ target: WOOD, prob: PLANT_TO_WOOD_PROBABILITY }),
    createNeighborPropagation({
      triggerCells: [WATER],
      prob: GROWTH_PROBABILITY,
    }),
  ],
}

export default Plant
