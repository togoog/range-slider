import * as fc from 'fast-check';
import { convertDataToOptions } from '../../services/converters';
import { makeData } from '../arbitraries';

test('convertDataToOptions', () => {
  fc.assert(
    fc.property(makeData(), data => {
      const options = convertDataToOptions(data);

      expect(options.value).toEqual(
        data.handleIds.map(id => data.handleDict[id].value),
      );
      expect(options.min).toEqual(data.min);
      expect(options.max).toEqual(data.max);
      expect(options.step).toEqual(data.step);
      expect(options.orientation).toEqual(data.orientation);
      expect(options.cssClass).toEqual(data.cssClass);
      expect(options.tooltips).toEqual(
        data.tooltipIds.map(id => data.tooltipDict[id].isVisible),
      );
      expect(options.tooltipFormat).toEqual(data.tooltipFormat);
      expect(options.intervals).toEqual(
        data.intervalIds.map(id => data.intervalDict[id].isVisible),
      );
      expect(options.grid).toEqual(data.grid);
      expect(options.gridFormat).toEqual(data.gridFormat);
    }),
  );
});
