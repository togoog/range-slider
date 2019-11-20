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
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 50,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
    },
    handleIds: ['handle_0'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 1,
    cssClass: 'range-slider',
    orientation: 'horizontal',
    tooltipDict: {
      tooltip_0: { id: 'tooltip_0', isVisible: true, handleId: 'handle_0' },
    },
    tooltipIds: ['tooltip_0'],
    tooltipFormatter: defaults.tooltipFormatter,
    tooltipCollisions: [],
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: true,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: false,
        lhsHandleId: 'handle_0',
        rhsHandleId: null,
      },
    },
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
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: -20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 0,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
      handle_2: {
        id: 'handle_2',
        value: 60,
        tooltipId: 'tooltip_2',
        lhsIntervalId: 'interval_2',
        rhsIntervalId: 'interval_3',
      },
      handle_3: {
        id: 'handle_3',
        value: 70,
        tooltipId: 'tooltip_3',
        lhsIntervalId: 'interval_3',
        rhsIntervalId: 'interval_4',
      },
    },
    handleIds: ['handle_0', 'handle_1', 'handle_2', 'handle_3'],
    activeHandleId: null,
    min: -100,
    max: 100,
    step: 5,
    cssClass: 'range-slider',
    orientation: 'vertical',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
      tooltip_2: {
        id: 'tooltip_2',
        isVisible: true,
        handleId: 'handle_2',
      },
      tooltip_3: {
        id: 'tooltip_3',
        isVisible: true,
        handleId: 'handle_3',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2', 'tooltip_3'],
    tooltipFormatter: defaults.tooltipFormatter,
    tooltipCollisions: [],
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: false,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: 'handle_2',
      },
      interval_3: {
        id: 'interval_3',
        isVisible: false,
        lhsHandleId: 'handle_2',
        rhsHandleId: 'handle_3',
      },
      interval_4: {
        id: 'interval_4',
        isVisible: false,
        lhsHandleId: 'handle_3',
        rhsHandleId: null,
      },
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
