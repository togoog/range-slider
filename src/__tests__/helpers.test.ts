import { Options, Data, State } from '../types';
import {
  $,
  convertOptionsToData,
  convertDataToOptions,
  convertDataToState,
} from '../helpers';

describe('$', () => {
  test('Should find existing elements', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = '.range-slider';
    const elements = $(selector);
    expect(elements.isJust()).toBe(true);
    expect(elements.extract()).toHaveLength(3);
  });

  test('Should return Nothing when no elements found', () => {
    document.body.innerHTML = `
      <span>some random text ...</span>
    `;
    const selector = '.range-slider';
    const elements = $(selector);
    expect(elements.isNothing()).toBe(true);
  });

  test('Should return Nothing if selector is not valid', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = `..range-slider`;
    const getElements = () => $(selector);
    expect(getElements).not.toThrow();
    expect(getElements().isNothing()).toBe(true);
  });

  test('Should return none if selector is empty string', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = '';
    const getElements = () => $(selector);
    expect(getElements).not.toThrow();
    expect(getElements().isNothing()).toBe(true);
  });
});

describe('convertOptionsToData', () => {
  test('should convert when value is a single number', () => {
    let options: Options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: true,
      intervals: false,
    };

    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      intervals: [false, false],
    };

    expect(convertOptionsToData(options)).toEqual(data);

    options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      intervals: [false, true, false],
    };

    data = {
      spots: [{ id: 'value_0', value: 50 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      intervals: [false, true, false],
    };

    expect(convertOptionsToData(options)).toEqual(data);
  });

  test('should convert when value is an array of numbers', () => {
    let options: Options = {
      value: [50, 70],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: true,
      intervals: false,
    };

    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      intervals: [false, false, false],
    };

    expect(convertOptionsToData(options)).toEqual(data);

    options = {
      value: [50, 70],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, true],
      intervals: [false, true],
    };

    data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, true],
      intervals: [false, true, false],
    };

    expect(convertOptionsToData(options)).toEqual(data);
  });
});

describe('convertDataToOptions', () => {
  test('should convert', () => {
    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      intervals: [false, false],
    };

    let options: Options = {
      value: [50],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      intervals: [false, false],
    };

    expect(convertDataToOptions(data)).toEqual(options);

    data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      intervals: [false, true, false],
    };

    options = {
      value: [50, 70],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      intervals: [false, true, false],
    };

    expect(convertDataToOptions(data)).toEqual(options);
  });
});

describe('convertDataToState', () => {
  test('should convert with 1 spot', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      intervals: [false, false],
    };

    const state: State = {
      origin: 'left',
      intervals: [
        {
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 50 },
        },
        {
          isVisible: false,
          from: { id: 'value_0', value: 50 },
          to: { id: 'last', value: 100 },
        },
      ],
      handles: [{ position: { id: 'value_0', value: 50 } }],
      tooltips: [
        {
          content: '50',
          position: { id: 'value_0', value: 50 },
          isVisible: true,
        },
      ],
    };

    expect(convertDataToState(data)).toEqual(state);
  });

  test('should convert with 2 spots', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 500 }, { id: 'value_1', value: 700 }],
      min: 0,
      max: 1000,
      step: 10,
      orientation: 'vertical',
      tooltips: [true, false],
      intervals: [false, true, false],
    };

    const state: State = {
      origin: 'bottom',
      intervals: [
        {
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 50 },
        },
        {
          isVisible: true,
          from: { id: 'value_0', value: 50 },
          to: { id: 'value_1', value: 70 },
        },
        {
          isVisible: false,
          from: { id: 'value_1', value: 70 },
          to: { id: 'last', value: 100 },
        },
      ],
      handles: [
        { position: { id: 'value_0', value: 50 } },
        { position: { id: 'value_1', value: 70 } },
      ],
      tooltips: [
        {
          content: '500',
          position: { id: 'value_0', value: 50 },
          isVisible: true,
        },
        {
          content: '700',
          position: { id: 'value_1', value: 70 },
          isVisible: false,
        },
      ],
    };

    expect(convertDataToState(data)).toEqual(state);
  });
});
