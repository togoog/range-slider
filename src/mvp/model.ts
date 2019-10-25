import { RangeSliderModel, Data, DataKey, Proposal } from '../types';
import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { mergeAll, applySpec, all, pluck, inc } from 'ramda';
import { inRange } from 'ramda-adjunct';
import { err } from '../errors';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

function errValueNotInRange(): Error {
  return err(`(spots < min || spots > max)`);
}

function errStepNotInRange(): Error {
  return err(`(step < 0 || step > max - min)`);
}

function errMinMax(): Error {
  return err(`(min > max)`);
}

function errTooltipsCount(): Error {
  return err(`(tooltips.length !== spots.length)`);
}

function errIntervalsCount(): Error {
  return err(`(intervals.length !== spots.length + 1)`);
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValueInRange({ min, max, spots }: Data): Maybe<Error> {
  if (min > max) {
    [min, max] = [max, min];
  }

  const valueInRange = all(inRange(min, inc(max)), pluck('value', spots));

  return valueInRange ? Nothing : Just(errValueNotInRange());
}

function checkIfStepInRange({ min, max, step }: Data): Maybe<Error> {
  const stepInRange = inRange(0, Math.abs(max - min), step);

  return stepInRange ? Nothing : Just(errStepNotInRange());
}

function checkMinMax({ min, max }: Data): Maybe<Error> {
  return max > min ? Nothing : Just(errMinMax());
}

function checkTooltipsCount({ spots, tooltips }: Data): Maybe<Error> {
  return tooltips.length === spots.length ? Nothing : Just(errTooltipsCount());
}

function checkIntervalsCount({ spots, intervals }: Data): Maybe<Error> {
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

  static checkDataIntegrity(data: Data): Either<Error[], Data> {
    const validationResults: Maybe<Error>[] = [];
    validationResults.push(checkMinMax(data));
    validationResults.push(checkIfValueInRange(data));
    validationResults.push(checkIfStepInRange(data));
    validationResults.push(checkTooltipsCount(data));
    validationResults.push(checkIntervalsCount(data));

    const errors: Error[] = Maybe.catMaybes(validationResults);

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
          this.emit(Model.EVENT_INTEGRITY_ERRORS, errors);
        },
        Right: cleanData => {
          this.data = cleanData;
          this.emit(Model.EVENT_UPDATE, cleanData);
        },
      });
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
