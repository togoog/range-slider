import { isEmpty, mergeAll, applySpec, all, forEach, keys, pick } from 'ramda';
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
} from '../types';
import logError from '../services/logger';
import { isSortedArray } from '../helpers';

//
// ─── ERROR IDS ──────────────────────────────────────────────────────────────────
//

const ErrorValuesNotInRange = 'RangeSlider/Model/ErrorValuesNotInRange';
const ErrorValuesOrder = 'RangeSlider/Model/ErrorValuesOrder';
const ErrorStepNotInRange = 'RangeSlider/Model/ErrorStepNotInRange';
const ErrorMinMax = 'RangeSlider/Model/ErrorMinMax';
const ErrorTooltipsCount = 'RangeSlider/Model/ErrorTooltipsCount';
const ErrorIntervalsCount = 'RangeSlider/Model/ErrorIntervalsCount';

//
// ─── ERROR CONSTRUCTORS ─────────────────────────────────────────────────────────
//

function errValuesNotInRange(): RangeSliderError {
  return {
    id: ErrorValuesNotInRange,
    desc: `(some values are less then min or greater than max)`,
  };
}

function errValuesOrder(): RangeSliderError {
  return {
    id: ErrorValuesOrder,
    desc: `(values should be in ascending order)`,
  };
}

function errStepNotInRange(): RangeSliderError {
  return {
    id: ErrorStepNotInRange,
    desc: `(step should be in range from 0 (zero) to max - min)`,
  };
}

function errMinMax(): RangeSliderError {
  return { id: ErrorMinMax, desc: `(max should be greater then min)` };
}

function errTooltipsCount(): RangeSliderError {
  return {
    id: ErrorTooltipsCount,
    desc: `(number of tooltips should equal number of values)`,
  };
}

function errIntervalsCount(): RangeSliderError {
  return {
    id: ErrorIntervalsCount,
    desc: `(number of intervals should be greater then number of values by 1)`,
  };
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValuesInRange({
  min,
  max,
  handleDict,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  if (min >= max) {
    // no point in checking handles if min >= max
    return Nothing;
  }

  const realValues = handleIds.map(id => handleDict[id].value);
  const inRangeInclusive = all(val => val >= min && val <= max, realValues);

  return inRangeInclusive ? Nothing : Just(errValuesNotInRange());
}

function checkValuesOrder({
  handleDict,
  handleIds,
}: Data): Maybe<RangeSliderError> {
  const realValues = handleIds.map(id => handleDict[id].value);
  const hasCorrectOrder = isSortedArray(realValues, 'ascending');

  return hasCorrectOrder ? Nothing : Just(errValuesOrder());
}

function checkIfStepInRange({ min, max, step }: Data): Maybe<RangeSliderError> {
  if (min >= max) {
    // no point in checking step if min >= max
    return Nothing;
  }

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

class Model extends EventEmitter implements RangeSliderModel {
  static EVENT_UPDATE = 'RangeSlider/Model/update';

  static EVENT_ERRORS = 'RangeSlider/Model/errors';

  constructor(private data: Data) {
    super();

    Model.validate(data)
      .mapLeft(forEach(logError))
      .map(data => this.updateData(data));
  }

  get<K extends DataKey>(key: K): Data[K] {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }

  pick<K extends DataKey>(keys: K[]): Partial<Data> {
    return pick(keys, this.data);
  }

  set(newData: Partial<Data>): RangeSliderModel {
    if (isEmpty(newData)) {
      return this;
    }

    // Can't overcome typescript warning if I specify type as Partial<Proposal>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proposal: any = {};
    const data = { ...this.data, ...newData };

    keys(data).forEach(key => {
      proposal[key] = () => data[key];
    });

    this.propose(proposal);

    return this;
  }

  static validate(data: Data): Either<RangeSliderError[], Data> {
    const validationResults = [];
    validationResults.push(checkMinMax(data));
    validationResults.push(checkIfValuesInRange(data));
    validationResults.push(checkValuesOrder(data));
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

    Model.validate(data)
      .mapLeft(errors => this.emit(Model.EVENT_ERRORS, errors))
      .map(data => this.updateData(data));
  }

  private updateData(data: Data): void {
    this.data = data;
    this.emit(Model.EVENT_UPDATE, data);
  }
}

export {
  Model,
  // error ids
  ErrorMinMax,
  ErrorStepNotInRange,
  ErrorValuesNotInRange,
  ErrorValuesOrder,
  ErrorTooltipsCount,
  ErrorIntervalsCount,
  // error constructors
  errValuesNotInRange,
  errValuesOrder,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
};
