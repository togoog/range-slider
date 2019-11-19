import { fromPairs, clamp, applySpec } from 'ramda';
import { isBoolean } from 'ramda-adjunct';
import {
  Data,
  DataKey,
  Options,
  OptionsKey,
  OptimizedOptions,
  IntervalId,
} from '../types';
import { toArray, createId, closestToStep, fillArrayWith } from '../helpers';
import * as defaults from '../defaults';

function prepareOptionsForInternalUse(options: Options): OptimizedOptions {
  const valuesLength = toArray(options.value).length;

  const transformations: {
    [key in OptionsKey]: (op: Options) => Options[OptionsKey];
  } = {
    value: op => toArray(op.value),
    min: op => op.min,
    max: op => op.max,
    step: op => op.step,
    orientation: op => op.orientation,
    cssClass: op => op.cssClass,
    tooltips: op =>
      // tooltips length should equal values length
      fillArrayWith(valuesLength, defaults.tooltipValue, toArray(op.tooltips)),
    tooltipFormatter: op => op.tooltipFormatter,
    intervals: op =>
      // intervals length should be greater then values length by 1
      fillArrayWith(
        valuesLength + 1,
        defaults.intervalValue,
        toArray(op.intervals),
      ),
    grid: op =>
      isBoolean(op.grid)
        ? { isVisible: op.grid, numCells: defaults.gridNumCells }
        : op.grid,
  };

  return applySpec(transformations)(options) as OptimizedOptions;
}

function convertOptionsToData(options: Options): Data {
  const optimizedOptions = prepareOptionsForInternalUse(options);

  const transformations: {
    [key in DataKey]: (op: OptimizedOptions) => Data[DataKey];
  } = {
    min: op => op.min,
    max: op => op.max,
    step: op => op.step,
    orientation: op => op.orientation,
    cssClass: op => op.cssClass,

    /** HANDLES */
    handles: op =>
      fromPairs(
        op.value.map((val, idx) => [
          createId('handle', idx),
          clamp(op.min, op.max, closestToStep(op.step, val)),
        ]),
      ),
    handleIds: op => op.value.map((_, idx) => createId('handle', idx)),
    activeHandleId: () => null,

    /** TOOLTIPS */
    tooltips: op =>
      fromPairs(
        op.tooltips.map((isVisible, idx) => [
          createId('tooltip', idx),
          isVisible,
        ]),
      ),
    tooltipIds: op => op.tooltips.map((_, idx) => createId('tooltip', idx)),
    tooltipFormatter: op => op.tooltipFormatter,
    // collisions between tooltips can only be known after render
    tooltipCollisions: () => [],

    /** INTERVALS */
    intervals: op =>
      fromPairs(
        op.intervals.map((isVisible, idx): [IntervalId, boolean] => [
          createId('interval', idx),
          isVisible,
        ]),
      ),
    intervalIds: op => op.intervals.map((_, idx) => createId('interval', idx)),

    /** GRID */
    grid: op => op.grid,
  };

  return applySpec(transformations)(optimizedOptions) as Data;
}

export default convertOptionsToData;
