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
import {
  mergeAll,
  applySpec,
  all,
  pluck,
  inc,
  indexBy,
  prop,
  intersection,
  dissoc,
} from 'ramda';
import { inRange } from 'ramda-adjunct';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

const ErrorValueNotInRange = 'RangeSlider/Model/ErrorValueNotInRange';
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
  intervals: [true, false],
};

class Model extends EventEmitter implements RangeSliderModel {
  private data!: Data;

  static EVENT_UPDATE = 'Model/update';
  static EVENT_INTEGRITY_ERRORS = 'Model/integrityErrors';

  constructor(data: Partial<Data> = defaultData) {
    super();

    const mergedData = mergeAll([defaultData, data]) as Data;

    // prettier-ignore
    Model
      .checkDataIntegrity(mergedData)
      .caseOf({
        // TODO: create logger service for errors
        Left: (errors) => {console.error(errors); this.data = defaultData;},
        Right: (data: Data) => {this.data = data;}
      });
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

  static checkDataIntegrity(data: Data): Either<RangeSliderError[], Data> {
    const validationResults = [];
    validationResults.push(checkMinMax(data));
    validationResults.push(checkIfValueInRange(data));
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
    // prettier-ignore
    Model
      .checkDataIntegrity(data)
      .caseOf({
        Left: errors => {
          this.tryRecoverFromErrors(errors, data);
        },
        Right: cleanData => {
          this.data = cleanData;
          this.emit(Model.EVENT_UPDATE, cleanData);
        },
      });
  }

  private tryRecoverFromErrors(errors: RangeSliderError[], data: Data): void {
    const unrecoverableErrors = [
      ErrorMinMax,
      ErrorStepNotInRange,
      ErrorTooltipsCount,
      ErrorIntervalsCount,
    ];

    let errorsMap = indexBy(prop('id'), errors);

    const hasUnrecoverableErrors =
      intersection(unrecoverableErrors, Object.keys(errorsMap)).length > 0;

    if (hasUnrecoverableErrors) {
      // can not recover
      this.emit(Model.EVENT_INTEGRITY_ERRORS, errors);
    } else {
      // try to recover from valueNotInRange error
      const newSpots = data.spots.map(spot => {
        const newSpot = { ...spot };
        if (newSpot.value < data.min) {
          newSpot.value = data.min;
        } else if (newSpot.value > data.max) {
          newSpot.value = data.max;
        }

        return newSpot;
      });

      errorsMap = dissoc(ErrorValueNotInRange, errorsMap);

      // process data again if no other errors
      if (Object.keys(errorsMap).length === 0) {
        this.processData({ ...data, spots: newSpots });
      } else {
        this.emit(Model.EVENT_INTEGRITY_ERRORS, Object.values(errorsMap));
      }
    }
  }
}

export {
  Model,
  // errors
  errValueNotInRange,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
};
