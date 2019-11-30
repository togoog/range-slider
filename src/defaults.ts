//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export const cssClass = 'range-slider';

//
// ─── TOOLTIP ────────────────────────────────────────────────────────────────────
//

export const tooltipValue = true;
export const tooltipFormatter = (value: number) => value.toLocaleString();

//
// ─── INTERVAL ───────────────────────────────────────────────────────────────────
//

export const intervalValue = false;

//
// ─── GRID ───────────────────────────────────────────────────────────────────────
//

// Number of cells on each level in order from biggest to smallest
// e.g.: [3, 4, 5] -> 3 big cells, 4 medium cells, 5 small cells
export const gridNumCells = [3, 2, 10];
