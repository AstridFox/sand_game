export interface Dims {
  /** Width of the grid in cells */
  width: number;
  /** Height of the grid in cells */
  height: number;
}

/** Width of the default simulation grid */
export const width = 200;
/** Height of the default simulation grid */
export const height = 150;

/** Default grid dimensions */
export const dims: Dims = { width, height };