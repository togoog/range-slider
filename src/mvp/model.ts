import {
  mergeAll,
  applySpec,
  all,
  inc,
  clamp,
  clone,
  indexBy,
  prop,
  pluck,
} from 'ramda';
import { inRange } from 'ramda-adjunct';
import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  RangeSliderError,
  RangeSliderModel,
  Data,
  DataKey,
  Proposal,
  HandleData,
  TooltipData,
  IntervalData,
} from '../types';
import { isSortedArray, createId } from '../helpers';
import * as defaults from '../defaults';

//
// ─── ERROR IDS ──────────────────────────────────────────────────────────────────
//

const ErrorHandlesNotInRange = 'RangeSlider/Model/ErrorHandlesNotInRange';
const ErrorHandlesOrder = 'RangeSlider/Model/ErrorHandlesOrder';
const ErrorStepNotInRange = 'RangeSlider/Model/ErrorStepNotInRange';
const ErrorMinMax = 'RangeSlider/Model/ErrorMinMax';
const ErrorTooltipsCount = 'RangeSlider/Model/ErrorTooltipsCount';
const ErrorIntervalsCount = 'RangeSlider/Model/ErrorIntervalsCount';

//
// ─── ERROR CONSTRUCTORS ─────────────────────────────────────────────────────────
//

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
// ─── ERROR FIXERS ───────────────────────────────────────────────────────────────
//

function fixErrorHandlesNotInRange(data: Data): Data {
  const { min, max, handleIds, handleDict } = data;

  if (min > max) {
    // no point in checking handles if min > max
    return { ...data };
  }

  const handles = handleIds.map(id => ({
    ...handleDict[id],
    value: clamp(min, max, handleDict[id].value),
  }));

  return {
    ...data,
    handleDict: indexBy(prop('id'), handles),
    handleIds: pluck('id', handles),
  };
}

function fixErrorHandlesOrder(data: Data): Data {
  const { min, max, handleIds, handleDict, activeHandleId } = data;

  const handles = handleIds.map(
    // eslint-disable-next-line complexity
    (id, idx, arr): HandleData => {
      const { value } = data.handleDict[id];
      const nextValue = arr[idx + 1] ? handleDict[arr[idx + 1]].value : max;
      const prevValue = arr[idx - 1] ? handleDict[arr[idx - 1]].value : min;
      const isActiveHandle = activeHandleId === id;
      const isBeyondBorders = value < prevValue || value > nextValue;

      if (isActiveHandle && isBeyondBorders) {
        return { ...handleDict[id], value: clamp(prevValue, nextValue, value) };
      }

      return { ...handleDict[id] };
    },
  );

  return {
    ...data,
    handleDict: indexBy(prop('id'), handles),
    handleIds: pluck('id', handles),
  };
}

function fixErrorStepNotInRange(data: Data): Data {
  const { min, max, step } = data;

  return { ...data, step: clamp(0, Math.abs(max - min), step) };
}

function fixErrorTooltipsCount(data: Data): Data {
  const { tooltipIds, tooltipDict, handleIds } = data;

  const tooltips = handleIds.map(
    (handleId, idx): TooltipData => {
      const tooltipId = tooltipIds[idx] || createId('tooltip', idx);

      return {
        id: tooltipId,
        isVisible: tooltipDict[tooltipId].isVisible || defaults.tooltipValue,
        handleId,
      };
    },
  );

  return {
    ...data,
    tooltipDict: indexBy(prop('id'), tooltips),
    tooltipIds: pluck('id', tooltips),
  };
}

function fixErrorIntervalsCount(data: Data): Data {
  const { handleIds, intervalIds, intervalDict } = data;

  const getId = (idx: number) => intervalIds[idx] || createId('interval', idx);

  const getVisibility = (idx: number) =>
    intervalDict[getId(idx)].isVisible || defaults.intervalValue;

  const getLhsHandleId = (idx: number) =>
    intervalDict[getId(idx)].lhsHandleId ||
    (idx > 0 ? createId('handle', idx - 1) : null);

  const getRhsHandleId = (idx: number) =>
    intervalDict[getId(idx)].rhsHandleId ||
    (idx < handleIds.length + 1 ? createId('handle', idx) : null);

  const intervals: IntervalData[] = [];
  for (let i = 0; i < handleIds.length + 1; i += 1) {
    (idx => {
      intervals.push({
        id: getId(idx),
        isVisible: getVisibility(idx),
        lhsHandleId: getLhsHandleId(idx),
        rhsHandleId: getRhsHandleId(idx),
      });
    })(i);
  }

  return {
    ...data,
    intervalDict: indexBy(prop('id'), intervals),
    intervalIds: pluck('id', intervals),
  };
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfHandlesInRange({
  min,
  max,
  handleDict,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  if (min > max) {
    // no point in checking handles if min > max
    return Nothing;
  }

  const realValues = handleIds.map(id => handleDict[id].value);
  const handlesAreInRange = all(inRange(min, inc(max)), realValues);

  return handlesAreInRange ? Nothing : Just(errHandlesNotInRange());
}

function checkHandlesOrder({
  handleDict,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  const realValues = handleIds.map(id => handleDict[id].value);
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
  handleDict: {
    handle_0: {
      id: 'handle_0',
      value: 50,
      tooltipId: 'tooltip_0',
      lhsIntervalId: 'interval_0',
      rhsIntervalId: 'interval_1',
    },
  },
  handleIds: ['handle_0'],
  activeHandleId: null,

  /** TOOLTIPS */
  tooltipDict: {
    tooltip_0: { id: 'tooltip_0', isVisible: true, handleId: 'handle_0' },
  },
  tooltipIds: ['tooltip_0'],
  tooltipFormatter: defaults.tooltipFormatter,
  tooltipCollisions: [],

  /** INTERVALS */
  intervalDict: {
    interval_0: {
      id: 'interval_0',
      isVisible: true,
      lhsHandleId: null,
      rhsHandleId: 'handle_0',
    },
    interval_1: {
      id: 'interval_1',
      isVisible: false,
      lhsHandleId: 'handle_0',
      rhsHandleId: null,
    },
  },
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
      // TODO: create logging service (do not use console.log directly)
      // eslint-disable-next-line no-console
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
          dataToBeFixed = fixErrorHandlesNotInRange(dataToBeFixed);
          break;
        case ErrorHandlesOrder:
          dataToBeFixed = fixErrorHandlesOrder(dataToBeFixed);
          break;
        case ErrorStepNotInRange:
          dataToBeFixed = fixErrorStepNotInRange(dataToBeFixed);
          break;
        case ErrorTooltipsCount:
          dataToBeFixed = fixErrorTooltipsCount(dataToBeFixed);
          break;
        case ErrorIntervalsCount:
          dataToBeFixed = fixErrorIntervalsCount(dataToBeFixed);
          break;
        default:
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
}

export {
  Model,
  // errors
  errHandlesNotInRange,
  errHandlesOrder,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
};
