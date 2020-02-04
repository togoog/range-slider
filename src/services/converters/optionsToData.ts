import { indexBy, prop, pluck } from 'ramda';
import { isBoolean } from 'ramda-adjunct';

import {
  Data,
  Options,
  OptimizedOptions,
  HandleData,
  TooltipData,
  IntervalData,
} from '../../types';
import { toArray, createId, closestToStep, fillArrayWith } from '../../helpers';
import * as defaults from '../../defaults';

/**
 * Optimize options for better developer experience
 * @param param0 user provided Options
 */
function prepareOptionsForInternalUse({
  value,
  min,
  max,
  step,
  orientation,
  cssClass,
  tooltips,
  tooltipFormat,
  intervals,
  grid,
  gridFormat,
}: Options): OptimizedOptions {
  const valuesLength = toArray(value).length;

  return {
    value: toArray(value),
    min,
    max,
    step,
    orientation,
    cssClass,

    // tooltips length should equal values length
    tooltips: fillArrayWith(
      valuesLength,
      defaults.tooltipValue,
      toArray(tooltips),
    ),
    tooltipFormat,

    // intervals length should be greater then values length by 1
    intervals: fillArrayWith(
      valuesLength + 1,
      defaults.intervalValue,
      toArray(intervals),
    ),

    grid: isBoolean(grid)
      ? { isVisible: grid, numCells: defaults.gridNumCells }
      : grid,
    gridFormat,
  };
}

/**
 * Convert user provided Options to model Data
 * @param options user provided Options
 */
function convertOptionsToData(options: Options): Data {
  const {
    value,
    min,
    max,
    step,
    orientation,
    cssClass,
    tooltips,
    tooltipFormat,
    intervals,
    grid,
    gridFormat,
  } = prepareOptionsForInternalUse(options);

  const handlesList = value.map(
    (val, idx): HandleData => ({
      id: createId('handle', idx),
      value: closestToStep(min, max, step, val),
      tooltipId: createId('tooltip', idx),
      lhsIntervalId: createId('interval', idx),
      rhsIntervalId: createId('interval', idx + 1),
    }),
  );

  const tooltipsList = tooltips.map(
    (val, idx): TooltipData => ({
      id: createId('tooltip', idx),
      isVisible: val,
      handleId: createId('handle', idx),
    }),
  );

  const intervalsList = intervals.map(
    (val, idx): IntervalData => ({
      id: createId('interval', idx),
      isVisible: val,
      lhsHandleId: idx > 0 ? createId('handle', idx - 1) : null,
      rhsHandleId: idx < value.length ? createId('handle', idx) : null,
    }),
  );

  return {
    min,
    max,
    step,
    orientation,
    cssClass,

    /** HANDLES */
    handleDict: indexBy(prop('id'), handlesList),
    handleIds: pluck('id', handlesList),
    activeHandleIds: [],
    handlesStackOrder: pluck('id', handlesList),

    /** TOOLTIPS */
    tooltipDict: indexBy(prop('id'), tooltipsList),
    tooltipIds: pluck('id', tooltipsList),
    tooltipFormat,
    // collisions between tooltips can only be known after render
    tooltipCollisions: [],

    /** INTERVALS */
    intervalDict: indexBy(prop('id'), intervalsList),
    intervalIds: pluck('id', intervalsList),

    /** GRID */
    grid,
    gridFormat,
  };
}

export default convertOptionsToData;
export { prepareOptionsForInternalUse };
