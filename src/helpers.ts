import {
  Options,
  Data,
  State,
  OptionsKey,
  DataKey,
  Origin,
  Position,
  Interval,
  Handle,
  Tooltip,
  ValueId,
  Orientation,
} from './types';
import { Maybe, Nothing, Just } from 'purify-ts/Maybe';
import {
  pipe,
  ifElse,
  always,
  pluck,
  clone,
  applySpec,
  zip,
  aperture,
  assoc,
  all,
} from 'ramda';
import { lengthEq } from 'ramda-adjunct';

/**
 * Query dom elements
 * @param selector css selector
 */
function $(selector: string, rootEl?: HTMLElement): Maybe<HTMLElement[]> {
  const element = typeof rootEl === 'undefined' ? document : rootEl;

  // prettier-ignore
  return Maybe
    .encase(() => element.querySelectorAll(selector))
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
function toArray<T>(v: T): T[] {
  return Array.isArray(v) ? [...v] : [v];
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

function convertOptionsToData(options: Options): Data {
  const clonedOptions = clone(options);

  const transformations: { [key in DataKey]: Function } = {
    spots: (op: Options) =>
      toArray(op.value).map((v, i) => ({ id: `value_${i}`, value: v })),
    activeSpotIds: () => [],
    min: (op: Options) => op.min,
    max: (op: Options) => op.max,
    step: (op: Options) => op.step,
    orientation: (op: Options) => op.orientation,
    tooltips: (op: Options) =>
      // TODO: maybe refactor false value to defaultTooltipValue
      fillArrayWith(
        toArray(op.tooltips),
        toArray(op.value).length,
        Array.isArray(op.tooltips) ? false : op.tooltips,
      ),
    intervals: (op: Options) =>
      // TODO: maybe refactor false value to defaultIntervalValue
      fillArrayWith(
        toArray(op.intervals),
        toArray(op.value).length + 1,
        Array.isArray(op.intervals) ? false : op.intervals,
      ),
  };

  return applySpec(transformations)(clonedOptions) as Data;
}

function convertDataToOptions(data: Data): Options {
  const clonedData = clone(data);

  const transformations: { [key in OptionsKey]: Function } = {
    value: (d: Data) => pluck('value', d.spots),
    min: (d: Data) => d.min,
    max: (d: Data) => d.max,
    step: (d: Data) => d.step,
    orientation: (d: Data) => d.orientation,
    tooltips: (d: Data) => d.tooltips,
    intervals: (d: Data) => d.intervals,
  };

  return applySpec(transformations)(clonedData) as Options;
}

function getRelativePosition(min: number, max: number, value: number): number {
  return ((value - min) / (max - min)) * 100;
}

/**
 * Create tooltip content from Data object
 * @param data Data object
 * @param index tooltip index
 */
function getTooltipContent(data: Data, index: number): string {
  return `Current value is: ${data.spots[index].value}`;
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
  const addIsActiveProp = (ids: ValueId[]) => (v: { position: Position }) =>
    assoc('isActive', ids.includes(v.position.id), v);
  const handles = handlePositions
    .map(position => ({ position }))
    .map(addOrientationProp)
    .map(addCSSClassProp(handleCSSClass))
    .map(addIsActiveProp(data.activeSpotIds)) as Handle[];

  // tooltips
  const tooltips: Tooltip[] = zip(data.tooltips, data.spots)
    .map(([isVisible, spot], index) => ({
      isVisible,
      content: getTooltipContent(data, index),
      position: {
        id: spot.id,
        value: getRelativePosition(data.min, data.max, spot.value),
      },
    }))
    .map(addOrientationProp)
    .map(addCSSClassProp(tooltipCSSClass));

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
function detectRectCollision(rectA: ClientRect, rectB: ClientRect): boolean {
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

export {
  $,
  getTooltipContent,
  detectRectCollision,
  // converters
  convertOrientationToOrigin,
  convertOptionsToData,
  convertDataToOptions,
  convertDataToState,
  // array utils
  isSortedArray,
};
