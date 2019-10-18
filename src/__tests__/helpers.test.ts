import { Options, Data } from '../types';
import { $, convertOptionsToData } from '../helpers';

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
