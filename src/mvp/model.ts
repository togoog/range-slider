import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { mergeAll, applySpec, identity } from 'ramda';
import { isFalse } from 'ramda-adjunct';
import { err } from '../errors';

//
// ─── MODEL EVENTS ───────────────────────────────────────────────────────────────
//

const EVENT_UPDATE = 'update';
const EVENT_INTEGRITY_ERRORS = 'integrityErrors';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

function errValueNotInRange(): Error {
  return err(`(min <= value <= max)`);
}

function errStepNotInRange(): Error {
  return err(`(0 <= step <= max - min)`);
}

function errMinIsGreaterThanMax(): Error {
  return err(`(min <= max)`);
}

function errTooltipsDoNotMatchWithValues(): Error {
  return err(`(tooltips.length == 1 || tooltips.length == value.length)`);
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValueInRange({ min, max, value }: ModelData): Maybe<Error> {
  // prettier-ignore
  const isNotInRange = value
    .map(v => v >= min && v <= max)
    .filter(isFalse)
    .length > 0;

  return isNotInRange ? Just(errValueNotInRange()) : Nothing;
}

function checkIfStepInRange({ min, max, step }: ModelData): Maybe<Error> {
  const threshold = max - min;
  const isNotInRange = step < 0 || step > threshold;
  return isNotInRange ? Just(errStepNotInRange()) : Nothing;
}

function checkIfMinIsLessThanOrEqualToMax({
  min,
  max,
}: ModelData): Maybe<Error> {
  return min > max ? Just(errMinIsGreaterThanMax()) : Nothing;
}

function checkIfTooltipsMatchValues({
  value,
  tooltips,
}: ModelData): Maybe<Error> {
  return tooltips.length !== 1 && tooltips.length !== value.length
    ? Just(errTooltipsDoNotMatchWithValues())
    : Nothing;
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultData: ModelData = {
  value: [50],
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: [true],
};

class Model extends EventEmitter implements RangeSliderModel {
  private data: ModelData;

  constructor(data: Partial<ModelData> = defaultData) {
    super();

    const mergedData = mergeAll([defaultData, data]) as ModelData;
    this.data = Model.checkDataIntegrity(mergedData).caseOf({
      Left: () => defaultData,
      Right: identity,
    });
  }

  get<K extends ModelDataKey>(key: K): ModelData[K] {
    return this.data[key];
  }

  set<K extends ModelDataKey>(key: K, value: ModelData[K]): RangeSliderModel {
    this.propose({ [key]: () => value });
    return this;
  }

  static checkDataIntegrity(data: ModelData): Either<Error[], ModelData> {
    const validationResults: Maybe<Error>[] = [];
    validationResults.push(checkIfMinIsLessThanOrEqualToMax(data));
    validationResults.push(checkIfValueInRange(data));
    validationResults.push(checkIfStepInRange(data));
    validationResults.push(checkIfTooltipsMatchValues(data));

    const errors: Error[] = Maybe.catMaybes(validationResults);

    return errors.length > 0 ? Left(errors) : Right(data);
  }

  /**
   * Ask model to change state
   * @param data chunk of ModelData
   */
  propose(proposal: Partial<ModelProposal>): ModelData {
    const newData = applySpec(proposal)(this.data) as Partial<ModelData>;
    const mergedData = mergeAll([this.data, newData]) as ModelData;

    return Model.checkDataIntegrity(mergedData).caseOf({
      Left: errors => {
        this.emit(EVENT_INTEGRITY_ERRORS, errors);
        return this.data;
      },
      Right: data => {
        this.update(data);
        return data;
      },
    });
  }

  private update(newData: ModelData): void {
    this.data = newData;
    this.emit(EVENT_UPDATE, newData);
  }
}

export {
  Model,
  // errors
  errValueNotInRange,
  errStepNotInRange,
  errMinIsGreaterThanMax,
  errTooltipsDoNotMatchWithValues,
  // events
  EVENT_UPDATE,
  EVENT_INTEGRITY_ERRORS,
};
