import { Options, Data, OptionsKey, DataKey } from './types';
import { Maybe, Nothing, Just } from 'purify-ts/Maybe';
import { pipe, ifElse, always, pluck, clone, applySpec } from 'ramda';
import { lengthEq } from 'ramda-adjunct';

/**
 * Query dom elements
 * @param selector css selector
 */
function $(selector: string): Maybe<HTMLElement[]> {
  // prettier-ignore
  return Maybe
    .encase(() => document.querySelectorAll(selector))
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
    min: (op: Options) => op.min,
    max: (op: Options) => op.max,
    step: (op: Options) => op.step,
    orientation: (op: Options) => op.orientation,
    tooltips: (op: Options) =>
      // TODO: maybe refactor false value to defaultTooltipValue
      fillArrayWith(toArray(op.tooltips), toArray(op.value).length, false),
    intervals: (op: Options) =>
      // TODO: maybe refactor false value to defaultIntervalValue
      fillArrayWith(toArray(op.intervals), toArray(op.value).length + 1, false),
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

export {
  $,
  // converters
  convertOptionsToData,
  convertDataToOptions,
};
