import {
  RangeSliderError,
  RangeSliderModel,
  Data,
  DataKey,
  Proposal,
} from '../types';
import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { mergeAll, applySpec, all, pluck, inc, clamp, clone } from 'ramda';
import { inRange } from 'ramda-adjunct';
import { isSortedArray } from '../helpers';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

const ErrorValueNotInRange = 'RangeSlider/Model/ErrorValueNotInRange';
const ErrorValueOrder = 'RangeSlider/Model/ErrorValueOrder';
const ErrorStepNotInRange = 'RangeSlider/Model/ErrorStepNotInRange';
const ErrorMinMax = 'RangeSlider/Model/ErrorMinMax';
const ErrorTooltipsCount = 'RangeSlider/Model/ErrorTooltipsCount';
const ErrorIntervalsCount = 'RangeSlider/Model/ErrorIntervalsCount';

function errValueNotInRange(): RangeSliderError {
  return {
    id: ErrorValueNotInRange,
    desc: `(spots < min || spots > max)`,
  };
}

function errValueOrder(): RangeSliderError {
  return {
    id: ErrorValueOrder,
    desc: `(spots[prev].value < spots[next].value)`,
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
    desc: `(tooltips.length !== spots.length)`,
  };
}

function errIntervalsCount(): RangeSliderError {
  return {
    id: ErrorIntervalsCount,
    desc: `(intervals.length !== spots.length + 1)`,
  };
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValueInRange({
  min,
  max,
  spots,
}: Data): Maybe<RangeSliderError> {
  if (min > max) {
    [min, max] = [max, min];
  }

  const valueInRange = all(inRange(min, inc(max)), pluck('value', spots));

  return valueInRange ? Nothing : Just(errValueNotInRange());
}

function checkValueOrder({ spots }: Data): Maybe<RangeSliderError> {
  const hasCorrectOrder = isSortedArray(pluck('value', spots), 'ascending');

  return hasCorrectOrder ? Nothing : Just(errValueOrder());
}

function checkIfStepInRange({ min, max, step }: Data): Maybe<RangeSliderError> {
  const stepInRange = inRange(0, Math.abs(max - min), step);

  return stepInRange ? Nothing : Just(errStepNotInRange());
}

function checkMinMax({ min, max }: Data): Maybe<RangeSliderError> {
  return max > min ? Nothing : Just(errMinMax());
}

function checkTooltipsCount({
  spots,
  tooltips,
}: Data): Maybe<RangeSliderError> {
  return tooltips.length === spots.length ? Nothing : Just(errTooltipsCount());
}

function checkIntervalsCount({
  spots,
  intervals,
}: Data): Maybe<RangeSliderError> {
  return intervals.length === spots.length + 1
    ? Nothing
    : Just(errIntervalsCount());
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultData: Data = {
  spots: [{ id: 'value_0', value: 50 }],
  activeSpotIds: [],
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: [true],
  tooltipsFormatter: (value: number) => value.toLocaleString(),
  tooltipCollisions: [],
  intervals: [true, false],
};

class Model extends EventEmitter implements RangeSliderModel {
  private data!: Data;

  static defaultTooltipValue = true;
  static defaultIntervalValue = false;

  static EVENT_UPDATE = 'Model/update';
  static EVENT_VALIDATION_ERRORS = 'Model/validationErrors';

  constructor(data: Partial<Data> = defaultData) {
    super();

    const mergedData = mergeAll([defaultData, data]) as Data;
    const validationResults = Model.validate(mergedData);
    this.data = validationResults.orDefault(defaultData);
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
    validationResults.push(checkIfValueInRange(data));
    validationResults.push(checkValueOrder(data));
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
    let fixedData: Data = clone(data);

    // eslint-disable-next-line complexity
    errors.forEach(error => {
      switch (error.id) {
        case ErrorValueNotInRange:
          fixedData = this.fixErrorValueNotInRange(fixedData);
          break;
        case ErrorValueOrder:
          fixedData = this.fixErrorValueOrder(fixedData);
          break;
        case ErrorMinMax:
          fixedData = this.fixErrorMinMax(fixedData);
          break;
        case ErrorStepNotInRange:
          fixedData = this.fixErrorStepNotInRange(fixedData);
          break;
        case ErrorTooltipsCount:
          fixedData = this.fixErrorTooltipsCount(fixedData);
          break;
        case ErrorIntervalsCount:
          fixedData = this.fixErrorIntervalsCount(fixedData);
          break;
      }
    });

    // validate data again
    if (Model.validate(fixedData).isLeft()) {
      this.emit(Model.EVENT_VALIDATION_ERRORS, errors);
    } else {
      this.updateData(fixedData);
    }
  }

  private fixErrorValueNotInRange(data: Data): Data {
    const { min, max } = data;

    // prettier-ignore
    const spots = data.spots.map(
      ({ id, value }) => ({id, value: clamp(min, max, value)})
    ) as Data['spots'];

    return { ...data, spots };
  }

  private fixErrorValueOrder(data: Data): Data {
    const spots = data.spots.map(({ id, value }, idx, arr) => {
      const nextValue = arr[idx + 1] ? arr[idx + 1].value : data.max;
      const prevValue = arr[idx - 1] ? arr[idx - 1].value : data.min;

      if (nextValue >= prevValue && data.activeSpotIds.includes(id)) {
        return { id, value: clamp(prevValue, nextValue, value) };
      }

      return { id, value };
    });

    return { ...data, spots };
  }

  private fixErrorMinMax(data: Data): Data {
    return { ...data, min: data.max, max: data.min };
  }

  private fixErrorStepNotInRange(data: Data): Data {
    const step = clamp(0, Math.abs(data.max - data.min), data.step);
    return { ...data, step };
  }

  private fixErrorTooltipsCount(data: Data): Data {
    const tooltips = data.spots.map(
      (_, idx) => data.tooltips[idx] || Model.defaultTooltipValue,
    );
    return { ...data, tooltips };
  }

  private fixErrorIntervalsCount(data: Data): Data {
    const intervals = [...Array(data.spots.length + 1)].map(
      (_, idx) => data.intervals[idx] || Model.defaultIntervalValue,
    );
    return { ...data, intervals };
  }
}

export {
  Model,
  // errors
  errValueNotInRange,
  errValueOrder,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
};
