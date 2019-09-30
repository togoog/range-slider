import { EventEmitter } from 'events';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { all, not, mergeAll } from 'ramda';
import { err, inRangeInclusive } from '../helpers';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

function errValueNotInRange(): Error {
  return err(`rule is broken (min <= value <= max)`);
}

function errStepNotInRange(): Error {
  return err(`rule is broken (0 <= step <= max - min)`);
}

function errMinIsGreaterThanMax(): Error {
  return err(`rule is broken (min <= max)`);
}

//
// ─── INTEGRITY VALIDATORS ───────────────────────────────────────────────────────
//

function checkIfValueInRange({ min, max, value }: ModelData): Maybe<Error> {
  const isInRange = all(inRangeInclusive(min, max), value);
  return not(isInRange) ? Just(errValueNotInRange()) : Nothing;
}

function checkIfStepInRange({ min, max, step }: ModelData): Maybe<Error> {
  const threshold = max - min;
  const isInRange = step >= 0 && step <= threshold;
  return not(isInRange) ? Just(errStepNotInRange()) : Nothing;
}

function checkIfMinIsLessThanOrEqualToMax({
  min,
  max,
}: ModelData): Maybe<Error> {
  return min > max ? Just(errMinIsGreaterThanMax()) : Nothing;
}

function checkDataIntegrity(data: ModelData): Either<Error[], ModelData> {
  const validationResults: Maybe<Error>[] = [];
  validationResults.push(checkIfMinIsLessThanOrEqualToMax(data));
  validationResults.push(checkIfValueInRange(data));
  validationResults.push(checkIfStepInRange(data));

  const errors: Error[] = Maybe.catMaybes(validationResults);

  return errors.length > 0 ? Left(errors) : Right(data);
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

class Model extends EventEmitter {
  constructor(private providedData: Partial<ModelData> = defaultData) {
    super();
    const data = mergeAll([defaultData, providedData]) as ModelData;
    const dataOrErrors = checkDataIntegrity(data);
  }
}

export {
  Model,
  checkDataIntegrity,
  errValueNotInRange,
  errStepNotInRange,
  errMinIsGreaterThanMax,
};
