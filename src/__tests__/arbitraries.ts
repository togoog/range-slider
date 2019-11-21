import * as fc from 'fast-check';
import { Options } from '../types';

function sortedArrayArb(minLength = 1, maxLength = 10) {
  return fc
    .array(fc.integer(), minLength, maxLength)
    .map(v => v.sort((a, b) => a - b));
}

function makeOptions() {
  return fc
    .record({
      value: sortedArrayArb(),
      numCells: fc.array(fc.nat(100), 1, 3),
      orientation: fc.constantFrom('horizontal', 'vertical'),
      seed: fc.nat(100),
    })
    .map(({ value, numCells, orientation, seed }) => {
      const min = Math.round(value[0] - seed);
      const max = Math.round(value[value.length - 1] + seed);
      const step = Math.min(max - min, seed);

      return {
        value,
        min,
        max,
        step,
        cssClass: 'range-slider',
        tooltips: value.map(v => v % 2 === 0),
        tooltipFormatter: (value: number) => value.toLocaleString(),
        intervals: [...value, value[0]].map(v => v % 2 === 0),
        orientation,
        grid: {
          isVisible: value.reduce((acc, cur) => acc + cur, 0) > 0,
          numCells,
        },
      } as Options;
    });
}

export { sortedArrayArb, makeOptions };
