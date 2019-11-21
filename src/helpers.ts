import { pipe, ifElse, always, aperture, all } from 'ramda';
import { lengthEq } from 'ramda-adjunct';
import { Maybe, Nothing, Just } from 'purify-ts/Maybe';

/**
 * Query dom elements
 * @param selector css selector
 */
function selectElements(
  selector: string,
  rootEl?: HTMLElement,
): Maybe<HTMLElement[]> {
  const element = typeof rootEl === 'undefined' ? document : rootEl;

  return (
    Maybe
      // if rootEl exists - restrict search only inside this element
      // ref: https://developer.mozilla.org/ru/docs/Web/API/Document/querySelectorAll
      .encase(() =>
        element.querySelectorAll(`${rootEl ? ':scope' : ''} ${selector}`),
      )
      .chain<HTMLElement[]>(
        ifElse(lengthEq(0), always(Nothing), pipe(Array.from, Just)),
      )
  );
}

/**
 * Convert value to array
 * @param v value to be converted
 */
function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? [...v] : [v];
}

/**
 * Get value rounded to closest step
 * @param step
 * @param value
 */
function closestToStep(
  min: number,
  max: number,
  step: number,
  value: number,
): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  if (step <= 0) {
    return value;
  }

  return min + Math.round((value - min) / step) * step;
}

/**
 * Check if 2 elements overlap
 * @param rectA DOMRect of element A
 * @param rectB DOMRect of element B
 */
function haveCollisions(rectA: DOMRect, rectB: DOMRect): boolean {
  return !(
    rectB.left >= rectA.right ||
    rectB.right <= rectA.left ||
    rectB.top >= rectA.bottom ||
    rectB.bottom <= rectA.top
  );
}

/**
 * Check if array is sorted in specified order
 */
function isSortedArray<T>(
  arr: T[],
  order: 'ascending' | 'descending' = 'ascending',
): boolean {
  const pairs = aperture(2, arr);

  return all(
    pair => (order === 'ascending' ? pair[0] <= pair[1] : pair[0] >= pair[1]),
    pairs,
  );
}

/**
 * Construct id from name and number
 * Is used to create ids for components (handles, tooltips, intervals ...)
 * @param entityName string
 * @param idx number
 */
function createId(entityName: string, idx: number): string {
  return `${entityName.replace(/\s+/g, '')}_${idx}`;
}

/**
 * Create new array from arr with length = neededLength and fill empty slots with value
 * @param neededLength new array length
 * @param value value to fill empty slots
 * @param arr initial array
 */
function fillArrayWith<A, B>(
  neededLength: number,
  value: B,
  arr: A[],
): (A | B)[] {
  if (arr.length >= neededLength) {
    return [...arr];
  }

  // fill remaining slots with value
  return arr.concat(Array(neededLength - arr.length).fill(value));
}

/**
 * Get relative position of value between min & max
 * @param min minimum value
 * @param max maximum value
 * @param value current value
 */
function getRelativePosition(min: number, max: number, value: number): number {
  return ((value - min) / (max - min)) * 100;
}

export {
  selectElements,
  haveCollisions,
  // utils
  createId,
  isSortedArray,
  toArray,
  fillArrayWith,
  closestToStep,
  getRelativePosition,
};
