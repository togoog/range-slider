import { Data, State } from '../../types';
import { convertDataToState } from '../../converters';
import * as defaults from '../../defaults';

test('convertDataToState', () => {
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
    grid: { isVisible: true, numCells: [2, 3, 4] },
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
        handleIds: ['handle_0'],
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
        handleIds: ['first', 'handle_0'],
        from: 0,
        to: 50,
        cssClass: 'range-slider__interval',
        isVisible: true,
        orientation: 'horizontal',
        role: 'interval',
      },
      {
        id: 'interval_1',
        handleIds: ['handle_0', 'last'],
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
    },
    grid: {
      isVisible: true,
      cssClass: 'range-slider__grid',
      orientation: 'horizontal',
      numCells: [2, 3, 4],
      min: data.min,
      max: data.max,
    },
  };

  expect(convertDataToState(data)).toEqual(state);

  const data_1: Data = {
    handles: { handle_0: -500, handle_1: 500 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: -1000,
    max: 1000,
    step: 100,
    cssClass: 'range-slider',
    orientation: 'vertical',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipFormatter: defaults.tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: true, numCells: [2, 3] },
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
        handleIds: ['handle_0'],
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
        handleIds: ['handle_1'],
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
        handleIds: ['first', 'handle_0'],
        from: 0,
        to: 25,
        cssClass: 'range-slider__interval',
        isVisible: false,
        orientation: 'vertical',
        role: 'interval',
      },
      {
        id: 'interval_1',
        handleIds: ['handle_0', 'handle_1'],
        from: 25,
        to: 75,
        cssClass: 'range-slider__interval',
        isVisible: true,
        orientation: 'vertical',
        role: 'interval',
      },
      {
        id: 'interval_2',
        handleIds: ['handle_1', 'last'],
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
    },
    grid: {
      isVisible: true,
      cssClass: 'range-slider__grid',
      orientation: 'vertical',
      numCells: [2, 3],
      min: data_1.min,
      max: data_1.max,
    },
  };

  expect(convertDataToState(data_1)).toEqual(state_1);
});
