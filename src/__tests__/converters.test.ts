import { Options, Data, State } from '../types';
import {
  convertOptionsToData,
  convertDataToOptions,
  convertDataToState,
} from '../converters';

const tooltipFormatter = (value: number) => value.toLocaleString();

test('convertOptionsToData', () => {
  const options: Options = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    cssClass: 'range-slider',
    orientation: 'horizontal',
    tooltips: true,
    tooltipFormatter,
    intervals: true,
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
    tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: true, interval_1: false },
    intervalIds: ['interval_0', 'interval_1'],
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
    tooltipFormatter,
    intervals: false,
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
    tooltipFormatter,
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
  };

  expect(convertOptionsToData(options_1)).toEqual(data_1);
});

test('convertDataToOptions', () => {
  const tooltipFormatter = (value: number) => value.toLocaleString();

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
    tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: true, interval_1: false },
    intervalIds: ['interval_0', 'interval_1'],
  };

  const options: Options = {
    value: [50],
    min: 0,
    max: 100,
    step: 1,
    cssClass: 'range-slider',
    orientation: 'horizontal',
    tooltips: [true],
    tooltipFormatter,
    intervals: [true, false],
  };

  expect(convertDataToOptions(data)).toEqual(options);

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
    tooltipFormatter,
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
  };

  const options_1: Options = {
    value: [-20, 0, 60, 70],
    min: -100,
    max: 100,
    step: 5,
    cssClass: 'range-slider',
    orientation: 'vertical',
    tooltips: [true, true, true, true],
    tooltipFormatter,
    intervals: [false, false, false, false, false],
  };

  expect(convertDataToOptions(data_1)).toEqual(options_1);
});

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
    tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: true, interval_1: false },
    intervalIds: ['interval_0', 'interval_1'],
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
        content: tooltipFormatter(50),
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
    tooltipFormatter,
    tooltipCollisions: [],
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
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
        content: tooltipFormatter(-500),
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
        content: tooltipFormatter(500),
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
  };

  expect(convertDataToState(data_1)).toEqual(state_1);
});
