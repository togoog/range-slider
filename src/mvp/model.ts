import { Data, DataKey, Proposal } from '../types';
import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { mergeAll, applySpec, all } from 'ramda';
import { inRange } from 'ramda-adjunct';
import { err } from '../errors';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

function errValueNotInRange(): Error {
  return err(`(min <= value <= max)`);
}

function errStepNotInRange(): Error {
  return err(`(0 <= step <= max - min)`);
}

function errMinMax(): Error {
  return err(`(min <= max)`);
}

function errTooltipsCount(): Error {
  return err(`(tooltips.length == 1 || tooltips.length == value.length)`);
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValueInRange({ min, max, value }: Data): Maybe<Error> {
  if (min > max) {
    [min, max] = [max, min];
  }

  const valueInRange = all(inRange(min, max), value);

  return valueInRange ? Nothing : Just(errValueNotInRange());
}

function checkIfStepInRange({ min, max, step }: Data): Maybe<Error> {
  const stepInRange = inRange(0, Math.abs(max - min), step);

  return stepInRange ? Nothing : Just(errStepNotInRange());
}

function checkMinMax({ min, max }: Data): Maybe<Error> {
  return max > min ? Nothing : Just(errMinMax());
}

function checkTooltipsCount({ value, tooltips }: Data): Maybe<Error> {
  return tooltips.length === value.length ? Nothing : Just(errTooltipsCount());
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultData: Data = {
  value: [50],
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: [true],
};

class Model extends EventEmitter implements Model {
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
        Left: () => this.data = defaultData,
        Right: (data: Data) => this.data = data
      });
  }

  get<K extends DataKey>(key: K): Data[K] {
    return this.data[key];
  }

  set<K extends DataKey>(key: K, value: Data[K]): Model {
    this.propose({ [key]: () => value });
    return this;
  }

  static checkDataIntegrity(data: Data): Either<Error[], Data> {
    const validationResults: Maybe<Error>[] = [];
    validationResults.push(checkMinMax(data));
    validationResults.push(checkIfValueInRange(data));
    validationResults.push(checkIfStepInRange(data));
    validationResults.push(checkTooltipsCount(data));

    const errors: Error[] = Maybe.catMaybes(validationResults);

    return errors.length > 0 ? Left(errors) : Right(data);
  }

  /**
   * Ask model to change state
   * @param data chunk of ModelData
   */
  propose(changeData: Partial<Proposal>): void {
    const newData = applySpec(changeData)(this.data) as Partial<Data>;
    const mergedData = mergeAll([this.data, newData]) as Data;

    // prettier-ignore
    return Model
      .checkDataIntegrity(mergedData)
      .caseOf({
        Left: errors => {
          this.emit(Model.EVENT_INTEGRITY_ERRORS, errors);
        },
        Right: data => {
          this.data = data;
          this.emit(Model.EVENT_UPDATE, data);
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
};
