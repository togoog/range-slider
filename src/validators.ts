import { all, allPass, partial } from 'ramda';
import { isNotObject, isPair } from 'ramda-adjunct';
import { Either, Left, Right } from 'purify-ts/Either';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

function err(s: string): Error {
  return new Error(s);
}

function errNotANumber(varName = '', v: unknown): Error {
  const msg = `
    ${varName} should be a number, 
    but ${typeof v} given instead
  `.trim();

  return err(msg);
}

function errNotANumberOrPairOfNumbers(varName = '', v: unknown): Error {
  const msg = `
    ${varName} should be a number or pair of numbers, 
    but ${typeof v} given instead
  `.trim();

  return err(msg);
}

function errNotOneOf(
  varName = '',
  possibleValues: unknown[],
  v: unknown,
): Error {
  const msg = `
      ${varName} should be one of: ${possibleValues.join(', ')}, 
      but ${v} given instead
    `.trim();

  return err(msg);
}

function errNotABooleanOrPairOfBooleans(varName = '', v: unknown) {
  const msg = `
    ${varName} should be a boolean or pair of booleans,
    but ${v} given instead
  `.trim();

  return err(msg);
}

function errIncorrectObjectShape(varName = '', keys: string[], v: unknown) {
  const msg = `
    ${varName} should be an object with keys:
    ${keys.join(', ')}
  `.trim();

  return err(msg);
}

// RSO - RangeSliderOptions
const errRSONotValidValue = partial(errNotANumberOrPairOfNumbers, [
  'RangeSliderOptions["value"]',
]);

const errRSONotValidMin = partial(errNotANumber, ['RangeSliderOptions["min"]']);

const errRSONotValidMax = partial(errNotANumber, ['RangeSliderOptions["max"]']);

const errRSONotValidStep = partial(errNotANumber, [
  'RangeSliderOptions["step"]',
]);

const errRSONotValidOrientation = partial(errNotOneOf, [
  'RangeSliderOptions["orientation"]',
  ['horizontal', 'vertical'],
]);

const errRSONotValidTooltips = partial(errNotABooleanOrPairOfBooleans, [
  'RangeSliderOptions["tooltips"]',
]);

const errRSOIncorrectShape = partial(errIncorrectObjectShape, [
  'RangeSliderOptions',
  ['value', 'min', 'max', 'step', 'orientation', 'tooltips'],
]);

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !isNaN(v);
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

function isPairOfNumbers(v: unknown): v is [number, number] {
  return allPass([isPair, all(isNumber)])(v);
}

function isPairOfBooleans(v: unknown): v is [boolean, boolean] {
  return allPass([isPair, all(isBoolean)])(v);
}

//
// ─── VALIDATORS ─────────────────────────────────────────────────────────────────
//

function checkValue(v: unknown): Either<Error, RangeSliderOptions['value']> {
  if (isNumber(v) || isPairOfNumbers(v)) {
    return Right(v);
  }

  return Left(errRSONotValidValue(v));
}

function checkMin(v: unknown): Either<Error, RangeSliderOptions['min']> {
  if (isNumber(v)) {
    return Right(v);
  }

  return Left(errRSONotValidMin(v));
}

function checkMax(v: unknown): Either<Error, RangeSliderOptions['max']> {
  if (isNumber(v)) {
    return Right(v);
  }

  return Left(errRSONotValidMax(v));
}

function checkStep(v: unknown): Either<Error, RangeSliderOptions['step']> {
  if (isNumber(v)) {
    return Right(v);
  }

  return Left(errRSONotValidStep(v));
}

function checkOrientation(
  v: unknown,
): Either<Error, RangeSliderOptions['orientation']> {
  if (v === 'horizontal' || v === 'vertical') {
    return Right(v);
  }

  return Left(errRSONotValidOrientation(v));
}

function checkTooltips(
  v: unknown,
): Either<Error, RangeSliderOptions['tooltips']> {
  if (isBoolean(v) || isPairOfBooleans(v)) {
    return Right(v);
  }

  return Left(errRSONotValidTooltips(v));
}

function checkRangeSliderOptions(
  v: unknown,
): Either<Error[], RangeSliderOptions> {
  if (isNotObject(v)) {
    return Left([errRSOIncorrectShape(v)]);
  }

  // pretend that v is RangeSliderOptions (for typings to work)
  const options = v as RangeSliderOptions;

  const validationResults: Either<Error, unknown>[] = [];
  validationResults.push(checkValue(options.value));
  validationResults.push(checkMin(options.min));
  validationResults.push(checkMax(options.max));
  validationResults.push(checkStep(options.step));
  validationResults.push(checkOrientation(options.orientation));
  validationResults.push(checkTooltips(options.tooltips));

  const errors = Either.lefts(validationResults);

  if (errors) {
    return Left(errors);
  }

  return Right(options);
}

export {
  // errors
  errRSONotValidValue,
  errRSONotValidMin,
  errRSONotValidMax,
  errRSONotValidStep,
  errRSONotValidOrientation,
  errRSONotValidTooltips,
  errRSOIncorrectShape,
  // validators
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkTooltips,
  checkRangeSliderOptions,
};
