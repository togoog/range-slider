import {
  Options,
  Data,
  State,
  OptionsKey,
  DataKey,
  Origin,
  Interval,
  Handle,
  Tooltip,
  Orientation,
  ValueId,
} from './types';
import { Maybe, Nothing, Just } from 'purify-ts/Maybe';
import {
  pipe,
  ifElse,
  always,
  path,
  clone,
  applySpec,
  zip,
  aperture,
  assoc,
  all,
  pluck,
} from 'ramda';
import { lengthEq, isNotEmpty } from 'ramda-adjunct';

/**
 * Query dom elements
 * @param selector css selector
 */
function $(selector: string, rootEl?: HTMLElement): Maybe<HTMLElement[]> {
  const element = typeof rootEl === 'undefined' ? document : rootEl;

  // prettier-ignore
  return Maybe
    // if rootEl exists - restrict search only inside this element
    // ref: https://developer.mozilla.org/ru/docs/Web/API/Document/querySelectorAll
    .encase(() => element.querySelectorAll(`${rootEl ? ':scope' : ''} ${selector}`))
    .chain<HTMLElement[]>(
      ifElse(
        lengthEq(0),
        always(Nothing),
        pipe(
          Array.from,
          Just,
        ),
      ),
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
function closestToStep(step: number, value: number): number {
  return step <= 0 ? value : Math.round(value / step) * step;
}

/**
 * Create new array from arr with length = neededLength and fill empty slots with value
 * @param arr initial array
 * @param neededLength new array length
 * @param value value to fill empty slots
 */
function fillArrayWith<T>(arr: T[], neededLength: number, value: T): T[] {
  if (arr.length >= neededLength) {
    return [...arr];
  }

  // fill remaining slots with value
  return arr.concat(Array(neededLength - arr.length).fill(value));
}

function arraysMatch<T>(first: T[], second: T[]): boolean {
  // check if arrays have the same length
  if (first.length !== second.length) return false;

  // check if all items are equal
  for (let i = 0; i < first.length; i += 1) {
    if (first[i] !== second[i]) return false;
  }

  return true;
}

/**
 * Check if tooltip has collisions with other tooltips by id
 * @param collisions tooltipCollisions array
 * @param idx tooltip index
 */
function checkIfTooltipHasCollisions(
  collisions: boolean[],
  idx: number,
): boolean {
  const cl = collisions.length;
  if (cl === 0) return false;

  const hasCollisionBefore = !!collisions[idx - 1];
  const hasCollisionAfter = !!collisions[idx];

  return hasCollisionBefore || hasCollisionAfter;
}

function joinTooltipsContent(
  data: Data,
  tooltips: Tooltip[],
): Tooltip['content'] {
  const contentList = pluck('content', tooltips);

  return contentList.join('; ');
}

function calculateTooltips(cssClass: string, data: Data): State['tooltips'] {
  const tooltips: Tooltip[] = zip(data.tooltips, data.spots)
    .map(([isVisible, spot], idx) => ({
      content: data.tooltipFormatter(data.spots[idx].value),
      position: {
        id: spot.id,
        value: getRelativePosition(data.min, data.max, spot.value),
      },
      isVisible,
      hasCollisions: checkIfTooltipHasCollisions(data.tooltipCollisions, idx),
    }))
    .map(assoc('orientation', data.orientation))
    .map(assoc('cssClass', cssClass));

  const mergedTooltips = tooltips
    // find groups of overlapping tooltips
    .reduce<Tooltip[][]>((result, tooltip, idx) => {
      if (tooltip.hasCollisions) {
        if (Array.isArray(result[result.length - 1])) {
          result[result.length - 1].push(tooltip);
        } else {
          result.push([tooltip]);
        }
      } else {
        result.push([]);
      }

      return result;
    }, [])
    .filter(isNotEmpty)
    // merge grouped tooltips into 1
    .map(
      (group: Tooltip[]): Tooltip => {
        return {
          orientation: group[0].orientation,
          cssClass: cssClass,
          content: joinTooltipsContent(data, group),
          position: {
            id: group.map(path(['position', 'id'])).join(','),
            value:
              (group[0].position.value +
                group[group.length - 1].position.value) /
              2,
          },
          role: 'tooltip-merged',
          hasCollisions: false,
          isVisible: true,
        };
      },
    );

  return tooltips.concat(mergedTooltips);
}

function convertDataToState(data: Data): State {
  // css classes
  // TODO: move css class names to Options
  const cssPrefix = 'curly';
  const cssClass = `${cssPrefix}-range-slider`;
  const trackCSSClass = `${cssClass}__track`;
  const intervalCSSClass = `${cssClass}__interval`;
  const handleCSSClass = `${cssClass}__handle`;
  const tooltipCSSClass = `${cssClass}__tooltip`;
  const addCSSClassProp = assoc('cssClass');

  // orientation
  const addOrientationProp = assoc('orientation', data.orientation);

  // track
  const track = {
    orientation: data.orientation,
    cssClass: trackCSSClass,
  };

  // intervals
  const firstPosition: Position = { id: 'first', value: 0 };
  const lastPosition: Position = { id: 'last', value: 100 };
  const handlePositions: Position[] = data.spots.map(spot => ({
    id: spot.id,
    value: getRelativePosition(data.min, data.max, spot.value),
  }));
  const allPositions: Position[] = [
    firstPosition,
    ...handlePositions,
    lastPosition,
  ];
  const intervals: Interval[] = zip(data.intervals, aperture(2, allPositions))
    .map(([isVisible, [from, to]]) => ({ isVisible, from, to }))
    .map(addOrientationProp)
    .map(addCSSClassProp(intervalCSSClass));

  // handles
  const addIsActiveProp = (ids: SpotId[]) => (v: { position: Position }) =>
    assoc('isActive', ids.includes(v.position.id), v);
  const handles = handlePositions
    .map(position => ({ position }))
    .map(addOrientationProp)
    .map(addCSSClassProp(handleCSSClass))
    .map(addIsActiveProp(data.activeSpotIds)) as Handle[];

  // tooltips
  const tooltips = calculateTooltips(tooltipCSSClass, data);

  return {
    cssClass,
    track,
    intervals,
    handles,
    tooltips,
  };
}

function convertOrientationToOrigin(orientation: Orientation): Origin {
  return orientation === 'horizontal' ? 'left' : 'bottom';
}

/**
 * Check if 2 elements overlap
 * @param rectA DOMRect of element A
 * @param rectB DOMRect of element B
 */
function detectRectCollision(rectA: DOMRect, rectB: DOMRect): boolean {
  return !(
    rectB.left >= rectA.right ||
    rectB.right <= rectA.left ||
    rectB.top >= rectA.bottom ||
    rectB.bottom <= rectA.top
  );
}

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

function makeId(entityName: string, idx: number): string {
  return `${entityName.replace(/\s+/g, '')}_${idx}`;
}

function getRelativePosition(min: number, max: number, value: number): number {
  return ((value - min) / (max - min)) * 100;
}

export {
  $,
  detectRectCollision,
  // converters
  convertOrientationToOrigin,
  convertDataToState,
  // utils
  makeId,
  isSortedArray,
  toArray,
  fillArrayWith,
  arraysMatch,
  closestToStep,
  checkIfTooltipHasCollisions,
  getRelativePosition,
};
