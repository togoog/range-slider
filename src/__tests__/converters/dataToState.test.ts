import { Data, State } from '../../types';
import { convertDataToState } from '../../converters';
import * as defaults from '../../defaults';

test('convertDataToState', () => {
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
    grid: { isVisible: true, numCells: [2] },
  };

  const state: State = {
    cssClass: 'range-slider',
    handles: [
      {
        id: 'handle_0',
        orientation: 'horizontal',
        isActive: false,
        position: 50,
        cssClass: 'range-slider__handle',
        role: 'handle',
      },
    ],
    tooltips: [
      {
        id: 'tooltip_0',
        content: defaults.tooltipFormatter(50),
        orientation: 'horizontal',
        cssClass: 'range-slider__tooltip',
        hasCollisions: false,
        isVisible: true,
        position: 50,
        role: 'tooltip',
      },
    ],
    intervals: [
      {
        id: 'interval_0',
        from: 0,
        to: 50,
        cssClass: 'range-slider__interval',
        isVisible: true,
        orientation: 'horizontal',
        role: 'interval',
      },
      {
        id: 'interval_1',
        from: 50,
        to: 100,
        cssClass: 'range-slider__interval',
        isVisible: false,
        orientation: 'horizontal',
        role: 'interval',
      },
    ],
    track: {
      cssClass: 'range-slider__track',
      orientation: 'horizontal',
      role: 'track',
    },
    grid: {
      isVisible: true,
      cssClass: 'range-slider__grid',
      orientation: 'horizontal',
      cells: [
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '0',
          level: 1,
          orientation: 'horizontal',
          position: 0,
          role: 'grid-cell',
        },
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '50',
          level: 1,
          orientation: 'horizontal',
          position: 50,
          role: 'grid-cell',
        },
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '100',
          level: 1,
          orientation: 'horizontal',
          position: 100,
          role: 'grid-cell',
        },
      ],
      min: data.min,
      max: data.max,
      role: 'grid',
    },
  };

  expect(convertDataToState(data)).toEqual(state);

  const data_1: Data = {
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: -500,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 500,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: -1000,
    max: 1000,
    step: 100,
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
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
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
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: true, numCells: [2] },
  };

  const state_1: State = {
    cssClass: 'range-slider',
    handles: [
      {
        id: 'handle_0',
        orientation: 'vertical',
        isActive: false,
        position: 25,
        cssClass: 'range-slider__handle',
        role: 'handle',
      },
      {
        id: 'handle_1',
        orientation: 'vertical',
        isActive: false,
        position: 75,
        cssClass: 'range-slider__handle',
        role: 'handle',
      },
    ],
    tooltips: [
      {
        id: 'tooltip_0',
        content: defaults.tooltipFormatter(-500),
        orientation: 'vertical',
        cssClass: 'range-slider__tooltip',
        hasCollisions: false,
        isVisible: true,
        position: 25,
        role: 'tooltip',
      },
      {
        id: 'tooltip_1',
        content: defaults.tooltipFormatter(500),
        orientation: 'vertical',
        cssClass: 'range-slider__tooltip',
        hasCollisions: false,
        isVisible: true,
        position: 75,
        role: 'tooltip',
      },
    ],
    intervals: [
      {
        id: 'interval_0',
        from: 0,
        to: 25,
        cssClass: 'range-slider__interval',
        isVisible: false,
        orientation: 'vertical',
        role: 'interval',
      },
      {
        id: 'interval_1',
        from: 25,
        to: 75,
        cssClass: 'range-slider__interval',
        isVisible: true,
        orientation: 'vertical',
        role: 'interval',
      },
      {
        id: 'interval_2',
        from: 75,
        to: 100,
        cssClass: 'range-slider__interval',
        isVisible: false,
        orientation: 'vertical',
        role: 'interval',
      },
    ],
    track: {
      cssClass: 'range-slider__track',
      orientation: 'vertical',
      role: 'track',
    },
    grid: {
      isVisible: true,
      cssClass: 'range-slider__grid',
      orientation: 'vertical',
      cells: [
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '-1000',
          level: 1,
          orientation: 'vertical',
          position: 0,
          role: 'grid-cell',
        },
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '0',
          level: 1,
          orientation: 'vertical',
          position: 50,
          role: 'grid-cell',
        },
        {
          cssClass: 'range-slider__grid-cell',
          isVisibleLabel: true,
          label: '1000',
          level: 1,
          orientation: 'vertical',
          position: 100,
          role: 'grid-cell',
        },
      ],
      min: data_1.min,
      max: data_1.max,
      role: 'grid',
    },
  };

  expect(convertDataToState(data_1)).toEqual(state_1);
});
