import * as fc from 'fast-check';
import { prop, indexBy, pluck } from 'ramda';
import { isEven } from 'ramda-adjunct';
import {
  Options,
  Data,
  State,
  HandleData,
  TooltipData,
  IntervalData,
} from '../types';
import { convertDataToState } from '../converters';
import { createId, closestToStep } from '../helpers';

function sortedArrayArb(minLength = 1, maxLength = 10) {
  return fc
    .array(fc.integer(), minLength, maxLength)
    .map(v => v.sort((a, b) => a - b));
}

function makeOptions() {
  return fc
    .record({
      value: sortedArrayArb(),
      numCells: fc.array(fc.nat(100), 1, 3),
      orientation: fc.constantFrom('horizontal', 'vertical'),
      seed: fc.nat(100),
    })
    .map(({ value, numCells, orientation, seed }) => {
      const min = Math.round(value[0] - seed);
      const max = Math.round(value[value.length - 1] + seed);
      const step = Math.min(max - min, seed);

      return {
        value,
        min,
        max,
        step,
        cssClass: 'range-slider',
        tooltips: value.map(isEven),
        tooltipFormatter: (value: number) => value.toLocaleString(),
        intervals: [...value, value[0]].map(isEven),
        orientation,
        grid: {
          isVisible: value.reduce((acc, cur) => acc + cur, 0) > 0,
          numCells,
        },
      } as Options;
    });
}

function makeData() {
  return fc
    .record({
      value: sortedArrayArb(),
      orientation: fc.constantFrom('horizontal', 'vertical'),
      numCells: fc.array(fc.nat(100), 1, 3),
      seed: fc.nat(100),
    })
    .map(({ value, orientation, numCells, seed }) => {
      const min = Math.round(value[0] - seed);
      const max = Math.round(value[value.length - 1] + seed + 1);
      const step = Math.min(max - min, seed);

      const handlesList = value.map(
        (val, idx): HandleData => ({
          id: createId('handle', idx),
          value: closestToStep(min, max, step, val),
          tooltipId: createId('tooltip', idx),
          lhsIntervalId: createId('interval', idx),
          rhsIntervalId: createId('interval', idx + 1),
        }),
      );

      const tooltipsList = value.map(isEven).map(
        (val, idx): TooltipData => ({
          id: createId('tooltip', idx),
          isVisible: val,
          handleId: createId('handle', idx),
        }),
      );

      const intervalsList = [...value, value[0]].map(isEven).map(
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
        cssClass: 'range-slider',

        // Handles
        handleIds: pluck('id', handlesList),
        handleDict: indexBy(prop('id'), handlesList),
        activeHandleIds: seed < 50 ? [] : [handlesList[0].id],
        handlesStackOrder: pluck('id', handlesList),

        // Tooltips
        tooltipIds: pluck('id', tooltipsList),
        tooltipDict: indexBy(prop('id'), tooltipsList),
        tooltipFormatter: (value: number) => value.toLocaleString(),
        // TODO: find a way to simulate tooltipCollisions
        tooltipCollisions: [],

        // Intervals
        intervalIds: pluck('id', intervalsList),
        intervalDict: indexBy(prop('id'), intervalsList),

        // Grid
        grid: {
          isVisible: value.reduce((acc, cur) => acc + cur, 0) > 0,
          numCells,
        },
      } as Data;
    });
}

function makeState() {
  return makeData().map(convertDataToState);
}

export { sortedArrayArb, makeOptions, makeData, makeState };
