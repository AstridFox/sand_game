import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

import {
  dims,
  Dims,
  CellDefinition,
  ScanState,
  createScanState,
  createGrid,
  createGrids,
  update,
} from '../src'

describe('simulation-engine: scheduler and grid utilities', () => {
  it('createGrid should return buffer of correct size', () => {
    const custom: Dims = { width: 4, height: 3 }
    const grid = createGrid(custom)
    expect(grid).toHaveLength(custom.width * custom.height)
  })

  it('createGrids should return two distinct buffers', () => {
    const [g1, g2] = createGrids(dims)
    expect(g1).not.toBe(g2)
    expect(g1).toHaveLength(dims.width * dims.height)
    expect(g2).toHaveLength(dims.width * dims.height)
  })

  it('should toggle scanState when toggleScanDirection is true', () => {
    const cellMap: Record<number, CellDefinition> = {
      0: { priority: 0, update: () => {} },
    }
    const priorities = [0]
    const grid = new Uint8Array([0])
    const newGrid = new Uint8Array([0])

    ;[true, false].forEach((toggle) => {
      const scanState: ScanState = createScanState(toggle)
      // initial state is always left-to-right, bottom-to-top
      update(grid, newGrid, cellMap, priorities, false, scanState)
      if (toggle) {
        expect(scanState.scanLeftToRight).toBe(false)
        expect(scanState.scanBottomToTop).toBe(false)
      } else {
        expect(scanState.scanLeftToRight).toBe(true)
        expect(scanState.scanBottomToTop).toBe(true)
      }
    })
  })

  it('should copy grid into newGrid before updates', () => {
    const custom: Dims = { width: 3, height: 2 }
    const size = custom.width * custom.height
    const values = Array.from({ length: size }, (_, i) => (i % 2) + 1)
    const grid = Uint8Array.from(values)
    const newGrid = new Uint8Array(size).fill(255)
    const cellMap: Record<number, CellDefinition> = {}
    values.forEach((v) => {
      cellMap[v] = { priority: 0, update: () => {} }
    })
    const priorities = [0]
    const scanState: ScanState = {
      scanLeftToRight: true,
      scanBottomToTop: true,
      toggleScanDirection: false,
    }

    update(grid, newGrid, cellMap, priorities, false, scanState)
    expect(newGrid).toEqual(grid)
  })

  it('property: scanState toggles correctly based on toggleScanDirection flag', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        (left, bottom, toggle) => {
          const grid = new Uint8Array([0])
          const newGrid = new Uint8Array([0])
          const cellMap: Record<number, CellDefinition> = {
            0: { priority: 0, update: () => {} },
          }
          const priorities = [0]
          const scanState: ScanState = {
            scanLeftToRight: left,
            scanBottomToTop: bottom,
            toggleScanDirection: toggle,
          }

          update(grid, newGrid, cellMap, priorities, false, scanState)
          expect(scanState.scanLeftToRight).toBe(toggle ? !left : left)
          expect(scanState.scanBottomToTop).toBe(toggle ? !bottom : bottom)
        },
      ),
    )
  })
})
