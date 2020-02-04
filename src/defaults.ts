//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export const cssClass = 'range-slider';

//
// ─── TOOLTIP ────────────────────────────────────────────────────────────────────
//

export const tooltipValue = true;
// format syntax is described in src/services/formatter.ts
export const tooltipFormat = '{{number}}';
// connector between content of 2 merged tooltips, that belong to same interval
export const tooltipSameIntervalConnector = '..';
// connector between content of 2 merged tooltips, that do not belong to same interval
export const tooltipNoIntervalConnector = ';';

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

// format syntax is described in src/services/formatter.ts
export const gridFormat = '{{number}}';
