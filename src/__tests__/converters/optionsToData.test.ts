import * as fc from 'fast-check';

import { convertOptionsToData } from '../../services/converters';
import { toArray, closestToStep } from '../../helpers';
import * as defaults from '../../defaults';
import { makeOptions } from '../arbitraries';

test('convertOptionsToData', () => {
  fc.assert(
    fc.property(makeOptions(), options => {
      const data = convertOptionsToData(options);
      const optValue = toArray(options.value);

      // Common
      expect(data.min).toEqual(options.min);
      expect(data.max).toEqual(options.max);
      expect(data.step).toEqual(options.step);
      expect(data.orientation).toEqual(options.orientation);
      expect(data.cssClass).toEqual(options.cssClass);

      // Handles
      expect(data.handleIds.length).toEqual(optValue.length);
      expect(Object.keys(data.handleDict).length).toEqual(optValue.length);
      expect(Object.keys(data.handleDict).length).toEqual(
        data.handleIds.length,
      );
      expect(Object.values(data.handleDict).map(v => v.value)).toEqual(
        optValue.map(v =>
          closestToStep(options.min, options.max, options.step, v),
        ),
      );
      expect(data.activeHandleIds).toEqual([]);

      // Tooltips
      expect(data.tooltipIds.length).toEqual(optValue.length);
      expect(Object.keys(data.tooltipDict).length).toEqual(optValue.length);
      expect(Object.keys(data.tooltipDict).length).toEqual(
        data.tooltipIds.length,
      );

      // Intervals
      expect(data.intervalIds.length).toEqual(optValue.length + 1);
      expect(Object.keys(data.intervalDict).length).toEqual(
        optValue.length + 1,
      );
      expect(Object.keys(data.intervalDict).length).toEqual(
        data.intervalIds.length,
      );

      // Grid
      expect(data.grid.isVisible).toEqual(
        typeof options.grid === 'boolean'
          ? options.grid
          : options.grid.isVisible,
      );
      expect(data.grid.numCells).toEqual(
        typeof options.grid === 'boolean'
          ? defaults.gridNumCells
          : options.grid.numCells,
      );
    }),
  );
});
