import { FIRE, CINDER, PLANT, WOOD, OIL } from '../ids'
import {
  createSpread,
  createSmoke,
  createExtinguish,
  createSpawn,
} from '../behaviors/combustion'
import { noise } from '../behaviors/utils'
import type { CellConfig } from '../Cell'

const FIRE_SPREAD_PROB = 0.5
const FIRE_SMOKE_PROB = 0.2
const FIRE_DEATH_PROB = 0.05
const FIRE_ASH_NEIGHBOR_THRESHOLD = 1
const FIRE_CINDER_PROB = 0.1

const Fire: CellConfig = {
  id: FIRE,
  name: 'Fire',
  color: (x, y, _t) => {
    const t = performance.now()
    const n = noise(x * 0.5, y * 0.5 + t / 100)
    const brightness = 0.7 + 0.3 * Math.sin(t / 150 + n * 10)
    const r = Math.floor(255 * brightness)
    const g = Math.floor(180 * brightness * n)
    const b = Math.floor(50 * brightness * n)
    return `rgb(${r},${g},${b})`
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
}

export default Fire
