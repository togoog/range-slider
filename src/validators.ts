import { Options } from './types';
import { all, allPass, anyPass, partial } from 'ramda';
import { isNotObject, isPair } from 'ramda-adjunct';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import {
  errNotANumber,
  errNotANumberOrPairOfNumbers,
  errNotOneOf,
  errNotABooleanOrPairOfBooleans,
  errIncorrectObjectShape,
} from './errors';

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

const errNotValidValue = partial(errNotANumberOrPairOfNumbers, [
  'RangeSliderOptions["value"]',
]);

const errNotValidMin = partial(errNotANumber, ['RangeSliderOptions["min"]']);

const errNotValidMax = partial(errNotANumber, ['RangeSliderOptions["max"]']);

const errNotValidStep = partial(errNotANumber, ['RangeSliderOptions["step"]']);

const errNotValidOrientation = partial(errNotOneOf, [
  'RangeSliderOptions["orientation"]',
  ['horizontal', 'vertical'],
]);

const errNotValidTooltips = partial(errNotABooleanOrPairOfBooleans, [
  'RangeSliderOptions["tooltips"]',
]);

const errIncorrectShape = partial(errIncorrectObjectShape, [
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

function checkValue(v: unknown): Maybe<Error> {
  return anyPass([isNumber, isPairOfNumbers])(v)
    ? Nothing
    : Just(errNotValidValue(v));
}

function checkMin(v: unknown): Maybe<Error> {
  return isNumber(v) ? Nothing : Just(errNotValidMin(v));
}

function checkMax(v: unknown): Maybe<Error> {
  return isNumber(v) ? Nothing : Just(errNotValidMax(v));
}

function checkStep(v: unknown): Maybe<Error> {
  return isNumber(v) ? Nothing : Just(errNotValidStep(v));
}

function checkOrientation(v: unknown): Maybe<Error> {
  return v === 'horizontal' || v === 'vertical'
    ? Nothing
    : Just(errNotValidOrientation(v));
}

function checkTooltips(v: unknown): Maybe<Error> {
  return isBoolean(v) || isPairOfBooleans(v)
    ? Nothing
    : Just(errNotValidTooltips(v));
}

function checkRangeSliderOptions(v: unknown): Either<Error[], Options> {
  if (isNotObject(v)) {
    return Left([errIncorrectShape(v)]);
  }

  // pretend that v is RangeSliderOptions (for typings to work)
  const options = v as Options;

  const validationResults: Maybe<Error>[] = [];
  validationResults.push(checkValue(options.value));
  validationResults.push(checkMin(options.min));
  validationResults.push(checkMax(options.max));
  validationResults.push(checkStep(options.step));
  validationResults.push(checkOrientation(options.orientation));
  validationResults.push(checkTooltips(options.tooltips));

  const errors = Maybe.catMaybes(validationResults);

  return errors.length > 0 ? Left(errors) : Right(options);
}

export {
  // errors
  errNotValidValue,
  errNotValidMin,
  errNotValidMax,
  errNotValidStep,
  errNotValidOrientation,
  errNotValidTooltips,
  errIncorrectShape,
  // validators
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkTooltips,
  checkRangeSliderOptions,
};
