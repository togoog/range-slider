//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export const cssClass = 'range-slider';

//
// ─── TOOLTIP ────────────────────────────────────────────────────────────────────
//

export const tooltipValue = true;
export const tooltipFormatter = function tooltipFormatter(
  value: number,
): string {
  return value.toLocaleString();
};

//
// ─── INTERVAL ───────────────────────────────────────────────────────────────────
//

export const intervalValue = false;

//
// ─── GRID ───────────────────────────────────────────────────────────────────────
//

export const gridIsVisible = false;

// Number of cells on each level in order from biggest to smallest
// e.g.: [3, 4, 5] -> 3 big cells, 4 medium cells, 5 small cells
export const gridNumCells = [3, 2, 10];

export const gridFormatter = function gridFormatter(value: number): string {
  return value.toLocaleString();
};
