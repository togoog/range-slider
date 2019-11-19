import { Options, Data } from '../../types';
import { convertOptionsToData } from '../../converters';
import * as defaults from '../../defaults';

test('convertOptionsToData', () => {
  const options: Options = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    cssClass: 'range-slider',
    orientation: 'horizontal',
    tooltips: true,
    tooltipFormatter: defaults.tooltipFormatter,
    intervals: true,
    grid: false,
  };

  const data: Data = {
    handles: { handle_0: 50 },
    handleIds: ['handle_0'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 1,
    cssClass: 'range-slider',
    orientation: 'horizontal',
    tooltips: { tooltip_0: true },
    tooltipIds: ['tooltip_0'],
    tooltipFormatter: defaults.tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: true, interval_1: false },
    intervalIds: ['interval_0', 'interval_1'],
    grid: { isVisible: false, numCells: defaults.gridNumCells },
  };

  expect(convertOptionsToData(options)).toEqual(data);

  const options_1: Options = {
    value: [-20, 0, 60, 70],
    min: -100,
    max: 100,
    step: 5,
    cssClass: 'range-slider',
    orientation: 'vertical',
    tooltips: true,
    tooltipFormatter: defaults.tooltipFormatter,
    intervals: false,
    grid: { isVisible: true, numCells: [2, 3] },
  };

  const data_1: Data = {
    handles: { handle_0: -20, handle_1: 0, handle_2: 60, handle_3: 70 },
    handleIds: ['handle_0', 'handle_1', 'handle_2', 'handle_3'],
    activeHandleId: null,
    min: -100,
    max: 100,
    step: 5,
    cssClass: 'range-slider',
    orientation: 'vertical',
    tooltips: {
      tooltip_0: true,
      tooltip_1: true,
      tooltip_2: true,
      tooltip_3: true,
    },
    tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2', 'tooltip_3'],
    tooltipFormatter: defaults.tooltipFormatter,
    tooltipCollisions: [],
    intervals: {
      interval_0: false,
      interval_1: false,
      interval_2: false,
      interval_3: false,
      interval_4: false,
    },
    intervalIds: [
      'interval_0',
      'interval_1',
      'interval_2',
      'interval_3',
      'interval_4',
    ],
    grid: { isVisible: true, numCells: [2, 3] },
  };

  expect(convertOptionsToData(options_1)).toEqual(data_1);
});
