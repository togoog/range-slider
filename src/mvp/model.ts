import {
  RangeSliderError,
  RangeSliderModel,
  Data,
  DataKey,
  Proposal,
  RealValue,
  HandleId,
  TooltipId,
  IntervalId,
} from '../types';
import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { mergeAll, applySpec, all, fromPairs, inc, clamp, clone } from 'ramda';
import { inRange } from 'ramda-adjunct';
import { isSortedArray, createId } from '../helpers';
import * as defaults from '../defaults';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

const ErrorHandlesNotInRange = 'RangeSlider/Model/ErrorHandlesNotInRange';
const ErrorHandlesOrder = 'RangeSlider/Model/ErrorHandlesOrder';
const ErrorStepNotInRange = 'RangeSlider/Model/ErrorStepNotInRange';
const ErrorMinMax = 'RangeSlider/Model/ErrorMinMax';
const ErrorTooltipsCount = 'RangeSlider/Model/ErrorTooltipsCount';
const ErrorIntervalsCount = 'RangeSlider/Model/ErrorIntervalsCount';

function errHandlesNotInRange(): RangeSliderError {
  return {
    id: ErrorHandlesNotInRange,
    desc: `(some handles have value less then min or greater than max)`,
  };
}

function errHandlesOrder(): RangeSliderError {
  return {
    id: ErrorHandlesOrder,
    desc: `(handle values should be in ascending order)`,
  };
}

function errStepNotInRange(): RangeSliderError {
  return {
    id: ErrorStepNotInRange,
    desc: `(step < 0 || step > max - min)`,
  };
}

function errMinMax(): RangeSliderError {
  return { id: ErrorMinMax, desc: `(min > max)` };
}

function errTooltipsCount(): RangeSliderError {
  return {
    id: ErrorTooltipsCount,
    desc: `(tooltips.length !== handles.length)`,
  };
}

function errIntervalsCount(): RangeSliderError {
  return {
    id: ErrorIntervalsCount,
    desc: `(intervals.length !== handles.length + 1)`,
  };
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfHandlesInRange({
  min,
  max,
  handles,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  if (min > max) {
    // no point in checking handles if min > max
    return Nothing;
  }

  const realValues = handleIds.map(id => handles[id]);
  const handlesAreInRange = all(inRange(min, inc(max)), realValues);

  return handlesAreInRange ? Nothing : Just(errHandlesNotInRange());
}

function checkHandlesOrder({
  handles,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  const realValues = handleIds.map(id => handles[id]);
  const hasCorrectOrder = isSortedArray(realValues, 'ascending');

  return hasCorrectOrder ? Nothing : Just(errHandlesOrder());
}

function checkIfStepInRange({ min, max, step }: Data): Maybe<RangeSliderError> {
  const stepInRange = inRange(0, Math.abs(max - min), step);

  return stepInRange ? Nothing : Just(errStepNotInRange());
}

function checkMinMax({ min, max }: Data): Maybe<RangeSliderError> {
  return max > min ? Nothing : Just(errMinMax());
}

function checkTooltipsCount({
  handleIds,
  tooltipIds,
}: Data): Maybe<RangeSliderError> {
  return tooltipIds.length === handleIds.length
    ? Nothing
    : Just(errTooltipsCount());
}

function checkIntervalsCount({
  handleIds,
  intervalIds,
}: Data): Maybe<RangeSliderError> {
  return intervalIds.length === handleIds.length + 1
    ? Nothing
    : Just(errIntervalsCount());
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultData: Data = {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  cssClass: 'range-slider',
  /** HANDLES */
  handles: { handle_0: 50 },
  handleIds: ['handle_0'],
  activeHandleId: null,
  /** TOOLTIPS */
  tooltips: { tooltip_0: true },
  tooltipIds: ['tooltip_0'],
  tooltipFormatter: (value: number) => value.toLocaleString(),
  tooltipCollisions: [],
  /** INTERVALS */
  intervals: { interval_0: true, interval_1: false },
  intervalIds: ['interval_0', 'interval_1'],
  /** GRID */
  grid: { isVisible: false, numCells: defaults.gridNumCells },
};

class Model extends EventEmitter implements RangeSliderModel {
  private data!: Data;

  static EVENT_UPDATE = 'Model/update';
  static EVENT_VALIDATION_ERRORS = 'Model/validationErrors';

  constructor(data: Partial<Data> = defaultData) {
    super();

    // add missing props
    const mergedData = mergeAll([defaultData, data]) as Data;

    // if data is not valid -> show message to user in console and exit
    const validationResults = Model.validate(mergedData);
    if (validationResults.isLeft()) {
      console.error(validationResults.toJSON());
      return;
    }

    this.data = validationResults.unsafeCoerce();
  }

  get<K extends DataKey>(key: K): Data[K] {
    return this.data[key];
  }

  set<K extends DataKey>(key: K, value: Data[K]): Model {
    this.propose({ [key]: () => value });
    return this;
  }

  getAll(): Data {
    return this.data;
  }

  setAll(data: Data): void {
    this.processData(data);
  }

  static validate(data: Data): Either<RangeSliderError[], Data> {
    const validationResults = [];
    validationResults.push(checkMinMax(data));
    validationResults.push(checkIfHandlesInRange(data));
    validationResults.push(checkHandlesOrder(data));
    validationResults.push(checkIfStepInRange(data));
    validationResults.push(checkTooltipsCount(data));
    validationResults.push(checkIntervalsCount(data));

    const errors: RangeSliderError[] = Maybe.catMaybes(validationResults);

    return errors.length > 0 ? Left(errors) : Right(data);
  }

  /**
   * Ask model to change state
   * @param data chunk of ModelData
   */
  propose(proposal: Partial<Proposal>): void {
    const newData = applySpec(proposal)(this.data) as Partial<Data>;
    const data = mergeAll([this.data, newData]) as Data;

    this.processData(data);
  }

  private processData(data: Data): void {
    const validationResults = Model.validate(data);

    if (validationResults.isLeft()) {
      validationResults.mapLeft(errors => this.tryFixErrors(errors, data));
    } else {
      this.updateData(data);
    }
  }

  private updateData(data: Data): void {
    this.data = data;
    this.emit(Model.EVENT_UPDATE, data);
  }

  private tryFixErrors(errors: RangeSliderError[], data: Data): void {
    let dataToBeFixed: Data = clone(data);

    // eslint-disable-next-line complexity
    errors.forEach(error => {
      switch (error.id) {
        case ErrorHandlesNotInRange:
          dataToBeFixed = this.fixErrorHandlesNotInRange(dataToBeFixed);
          break;
        case ErrorHandlesOrder:
          dataToBeFixed = this.fixErrorHandlesOrder(dataToBeFixed);
          break;
        case ErrorStepNotInRange:
          dataToBeFixed = this.fixErrorStepNotInRange(dataToBeFixed);
          break;
        case ErrorTooltipsCount:
          dataToBeFixed = this.fixErrorTooltipsCount(dataToBeFixed);
          break;
        case ErrorIntervalsCount:
          dataToBeFixed = this.fixErrorIntervalsCount(dataToBeFixed);
          break;
      }
    });

    // validate data again
    if (Model.validate(dataToBeFixed).isLeft()) {
      this.emit(Model.EVENT_VALIDATION_ERRORS, errors);
    } else {
      this.updateData(dataToBeFixed);
    }
  }

  private fixErrorHandlesNotInRange(data: Data): Data {
    const { min, max } = data;

    if (min > max) {
      // no point in checking handles if min > max
      return { ...data };
    }

    const handles = fromPairs(
      data.handleIds.map(id => [id, clamp(min, max, data.handles[id])]),
    );

    return { ...data, handles };
  }

  private fixErrorHandlesOrder(data: Data): Data {
    // eslint-disable-next-line complexity
    const handlePairs = data.handleIds.map((id, idx, arr): [
      HandleId,
      RealValue,
    ] => {
      const value = data.handles[id];
      const nextValue = arr[idx + 1] ? data.handles[arr[idx + 1]] : data.max;
      const prevValue = arr[idx - 1] ? data.handles[arr[idx - 1]] : data.min;
      const isActiveHandle = data.activeHandleId === id;
      const isBeyondBorders = value < prevValue || value > nextValue;

      if (isActiveHandle && isBeyondBorders) {
        return [id, clamp(prevValue, nextValue, value)];
      }

      return [id, value];
    });

    return { ...data, handles: fromPairs(handlePairs) };
  }

  private fixErrorStepNotInRange(data: Data): Data {
    const step = clamp(0, Math.abs(data.max - data.min), data.step);
    return { ...data, step };
  }

  private fixErrorTooltipsCount(data: Data): Data {
    const tooltipPairs = data.handleIds.map((_, idx): [TooltipId, boolean] => [
      data.tooltipIds[idx] || createId('tooltip', idx),
      data.tooltips[idx] || defaults.tooltipValue,
    ]);

    const tooltipIds = tooltipPairs.map(pair => pair[0]);

    return { ...data, tooltips: fromPairs(tooltipPairs), tooltipIds };
  }

  private fixErrorIntervalsCount(data: Data): Data {
    const intervalPairs = [...Array(data.handleIds.length + 1)].map((_, idx): [
      IntervalId,
      boolean,
    ] => [
      data.intervalIds[idx] || createId('interval', idx),
      data.intervals[idx] || defaults.intervalValue,
    ]);

    const intervalIds = intervalPairs.map(pair => pair[0]);

    return { ...data, intervals: fromPairs(intervalPairs), intervalIds };
  }
}

export {
  Model,
  // errors
  errHandlesNotInRange as errValueNotInRange,
  errHandlesOrder as errValueOrder,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
};
