import { Options, Data, State } from '../types';
import {
  $,
  detectRectCollision,
  convertOptionsToData,
  convertDataToOptions,
  convertDataToState,
  isSortedArray,
  arraysMatch,
  closestToStep,
  checkIfTooltipHasCollisions,
} from '../helpers';

const cssPrefix = 'curly';
const cssClass = `${cssPrefix}-range-slider`;
const trackCSSClass = `${cssClass}__track`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

const tooltipsFormatter = (value: number) => value.toLocaleString();

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

  test('Should return Nothing if selector is empty string', () => {
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
      tooltipsFormatter,
      intervals: false,
    };

    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
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
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    data = {
      spots: [{ id: 'value_0', value: 50 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
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
      tooltipsFormatter,
      intervals: false,
    };

    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
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
      tooltipsFormatter,
      intervals: [false, true],
    };

    data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    expect(convertOptionsToData(options)).toEqual(data);
  });
});

describe('convertDataToOptions', () => {
  test('should convert', () => {
    let data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, false],
    };

    let options: Options = {
      value: [50],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipsFormatter,
      intervals: [false, false],
    };

    expect(convertDataToOptions(data)).toEqual(options);

    data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    options = {
      value: [50, 70],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true, false],
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    expect(convertDataToOptions(data)).toEqual(options);
  });
});

describe('convertDataToState', () => {
  test('should convert with 1 spot', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 50 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, false],
    };

    const state: State = {
      cssClass,
      track: { orientation: 'horizontal', cssClass: trackCSSClass },
      intervals: [
        {
          orientation: 'horizontal',
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 50 },
          cssClass: intervalCSSClass,
        },
        {
          orientation: 'horizontal',
          isVisible: false,
          from: { id: 'value_0', value: 50 },
          to: { id: 'last', value: 100 },
          cssClass: intervalCSSClass,
        },
      ],
      handles: [
        {
          orientation: 'horizontal',
          position: { id: 'value_0', value: 50 },
          cssClass: handleCSSClass,
          isActive: false,
        },
      ],
      tooltips: [
        {
          orientation: 'horizontal',
          content: data.tooltipsFormatter(data.spots[0].value),
          position: { id: 'value_0', value: 50 },
          isVisible: true,
          hasCollisions: false,
          cssClass: tooltipCSSClass,
        },
      ],
    };

    expect(convertDataToState(data)).toEqual(state);
  });

  test('should convert with 2 spots', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 500 }, { id: 'value_1', value: 700 }],
      activeSpotIds: [],
      min: 0,
      max: 1000,
      step: 10,
      orientation: 'vertical',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    const state: State = {
      cssClass,
      track: { orientation: 'vertical', cssClass: trackCSSClass },
      intervals: [
        {
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 50 },
          cssClass: intervalCSSClass,
        },
        {
          orientation: 'vertical',
          isVisible: true,
          from: { id: 'value_0', value: 50 },
          to: { id: 'value_1', value: 70 },
          cssClass: intervalCSSClass,
        },
        {
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'value_1', value: 70 },
          to: { id: 'last', value: 100 },
          cssClass: intervalCSSClass,
        },
      ],
      handles: [
        {
          orientation: 'vertical',
          position: { id: 'value_0', value: 50 },
          cssClass: handleCSSClass,
          isActive: false,
        },
        {
          orientation: 'vertical',
          position: { id: 'value_1', value: 70 },
          cssClass: handleCSSClass,
          isActive: false,
        },
      ],
      tooltips: [
        {
          orientation: 'vertical',
          content: data.tooltipsFormatter(data.spots[0].value),
          position: { id: 'value_0', value: 50 },
          isVisible: true,
          hasCollisions: false,
          cssClass: tooltipCSSClass,
        },
        {
          orientation: 'vertical',
          content: data.tooltipsFormatter(data.spots[1].value),
          position: { id: 'value_1', value: 70 },
          isVisible: false,
          hasCollisions: false,
          cssClass: tooltipCSSClass,
        },
      ],
    };

    expect(convertDataToState(data)).toEqual(state);
  });

  test('should set active handles', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 500 }, { id: 'value_1', value: 700 }],
      activeSpotIds: ['value_0', 'value_1'],
      min: 0,
      max: 1000,
      step: 10,
      orientation: 'vertical',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };

    const state: State = {
      cssClass,
      track: { orientation: 'vertical', cssClass: trackCSSClass },
      intervals: [
        {
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 50 },
          cssClass: intervalCSSClass,
        },
        {
          orientation: 'vertical',
          isVisible: true,
          from: { id: 'value_0', value: 50 },
          to: { id: 'value_1', value: 70 },
          cssClass: intervalCSSClass,
        },
        {
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'value_1', value: 70 },
          to: { id: 'last', value: 100 },
          cssClass: intervalCSSClass,
        },
      ],
      handles: [
        {
          orientation: 'vertical',
          position: { id: 'value_0', value: 50 },
          cssClass: handleCSSClass,
          isActive: true,
        },
        {
          orientation: 'vertical',
          position: { id: 'value_1', value: 70 },
          cssClass: handleCSSClass,
          isActive: true,
        },
      ],
      tooltips: [
        {
          orientation: 'vertical',
          content: data.tooltipsFormatter(data.spots[0].value),
          position: { id: 'value_0', value: 50 },
          isVisible: true,
          hasCollisions: false,
          cssClass: tooltipCSSClass,
        },
        {
          orientation: 'vertical',
          content: data.tooltipsFormatter(data.spots[1].value),
          position: { id: 'value_1', value: 70 },
          isVisible: false,
          hasCollisions: false,
          cssClass: tooltipCSSClass,
        },
      ],
    };

    expect(convertDataToState(data)).toEqual(state);
  });
});

describe('detectRectCollision', () => {
  test('should return true if 2 elements overlap', () => {
    // overlap a.right & b.left sides
    const rectA: DOMRect = {
      top: 100,
      left: 100,
      bottom: 200,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => '',
    };
    const rectB: DOMRect = {
      top: 100,
      left: 190,
      bottom: 200,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => '',
    };

    expect(detectRectCollision(rectA, rectB)).toBe(true);
  });

  test('should return false if 2 elements do not overlap', () => {
    // overlap a.right & b.left sides
    const rectA: DOMRect = {
      top: 100,
      left: 100,
      bottom: 200,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => '',
    };
    const rectB: DOMRect = {
      top: 100,
      left: 300,
      bottom: 200,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => '',
    };

    expect(detectRectCollision(rectA, rectB)).toBe(false);
  });
});

describe('isSortedArray', () => {
  test('should return true for sorted array', () => {
    expect(isSortedArray([1, 2, 3, 4, 5])).toBe(true);
    expect(isSortedArray([5, 4, 3, 2, 1], 'descending')).toBe(true);
    expect(isSortedArray([])).toBe(true);
    expect(isSortedArray([1])).toBe(true);
    expect(isSortedArray([1], 'descending')).toBe(true);
  });

  test('should return false for not sorted array', () => {
    expect(isSortedArray([1, 2, 3, 4, 5], 'descending')).toBe(false);
    expect(isSortedArray([5, 4, 3, 2, 1], 'ascending')).toBe(false);
    expect(isSortedArray([5, 1, 3, 2, 4], 'ascending')).toBe(false);
    expect(isSortedArray([2, 4], 'descending')).toBe(false);
  });
});

describe('arraysMatch', () => {
  test('empty arrays are equal', () => {
    expect(arraysMatch([], [])).toBe(true);
  });

  test('arrays with different length are not equal', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    arr2.length = 5;
    expect(arraysMatch(arr1, arr2)).toBe(false);
  });

  test('arrays with same items, but in different order are not equal', () => {
    expect(arraysMatch([1, 2, 3], [3, 2, 1])).toBe(false);
  });

  test('arrays with same elements and in same order are equal', () => {
    expect(arraysMatch([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysMatch(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
  });
});

describe('closestToStep', () => {
  test('should return value unchanged if step <= 0', () => {
    expect(closestToStep(0, 1)).toBe(1);
    expect(closestToStep(0, -10)).toBe(-10);
    expect(closestToStep(0, 4.56)).toBe(4.56);
    expect(closestToStep(-1, 1)).toBe(1);
  });

  test('should return value rounded to closest step if step ', () => {
    expect(closestToStep(1, 10)).toBe(10);
    expect(closestToStep(2, 31)).toBe(32);
    expect(closestToStep(0.5, 5.3)).toBe(5.5);
  });
});

describe('checkIfTooltipHasCollisions', () => {
  test('should return false if collisions is empty array', () => {
    expect(checkIfTooltipHasCollisions([], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([], 1)).toBe(false);
    expect(checkIfTooltipHasCollisions([], 2)).toBe(false);
  });

  test('should return true if tooltip has collisions or false if not', () => {
    expect(checkIfTooltipHasCollisions([true], 0)).toBe(true);
    expect(checkIfTooltipHasCollisions([true], 1)).toBe(true);

    expect(checkIfTooltipHasCollisions([false], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false], 1)).toBe(false);

    expect(checkIfTooltipHasCollisions([true, true], 0)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, true], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, true], 2)).toBe(true);

    expect(checkIfTooltipHasCollisions([true, false], 0)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, false], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, false], 2)).toBe(false);

    expect(checkIfTooltipHasCollisions([false, true], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, true], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, true], 2)).toBe(true);

    expect(checkIfTooltipHasCollisions([false, false], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, false], 1)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, false], 2)).toBe(false);

    expect(checkIfTooltipHasCollisions([true, true, true], 0)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, true, true], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, true, true], 2)).toBe(true);
    expect(checkIfTooltipHasCollisions([true, true, true], 3)).toBe(true);

    expect(checkIfTooltipHasCollisions([false, true, true], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, true, true], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, true, true], 2)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, true, true], 3)).toBe(true);

    expect(checkIfTooltipHasCollisions([false, false, true], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, false, true], 1)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, false, true], 2)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, false, true], 3)).toBe(true);

    expect(checkIfTooltipHasCollisions([false, true, false], 0)).toBe(false);
    expect(checkIfTooltipHasCollisions([false, true, false], 1)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, true, false], 2)).toBe(true);
    expect(checkIfTooltipHasCollisions([false, true, false], 3)).toBe(false);
  });
});
