import {
  selectElements,
  haveCollisions,
  isSortedArray,
  fillArrayWith,
} from '../helpers';

describe('$', () => {
  test('Should find existing elements', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = '.range-slider';
    const elements = selectElements(selector);
    expect(elements.isJust()).toBe(true);
    expect(elements.extract()).toHaveLength(3);
  });

  test('Should return Nothing when no elements found', () => {
    document.body.innerHTML = `
      <span>some random text ...</span>
    `;
    const selector = '.range-slider';
    const elements = selectElements(selector);
    expect(elements.isNothing()).toBe(true);
  });

  test('Should return Nothing if selector is not valid', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = `..range-slider`;
    const getElements = () => selectElements(selector);
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
    const getElements = () => selectElements(selector);
    expect(getElements).not.toThrow();
    expect(getElements().isNothing()).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('haveCollisions', () => {
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

    expect(haveCollisions(rectA, rectB)).toBe(true);
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

    expect(haveCollisions(rectA, rectB)).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────────────────────

describe('fillArrayWith', () => {
  test('should fill remaining places in array with provided value', () => {
    expect(fillArrayWith(5, 0, [1, 2, 3])).toEqual([1, 2, 3, 0, 0]);
    expect(fillArrayWith(5, 'a', [1, 2, 3])).toEqual([1, 2, 3, 'a', 'a']);
    expect(fillArrayWith(5, null, [1, 2, 3])).toEqual([1, 2, 3, null, null]);
    expect(fillArrayWith(5, undefined, [1, 2, 3])).toEqual([
      1,
      2,
      3,
      undefined,
      undefined,
    ]);
    expect(fillArrayWith(3, true, [])).toEqual([true, true, true]);
  });

  test('should not change array if new length is <= old length', () => {
    expect(fillArrayWith(3, 'd', ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    expect(fillArrayWith(2, 1, ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    expect(fillArrayWith(2, 0, ['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});
