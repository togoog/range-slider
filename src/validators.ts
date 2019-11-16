import { all, allPass, anyPass, where } from 'ramda';
import {
  isObject,
  isNotObject,
  isArray,
  isFunction,
  isString,
} from 'ramda-adjunct';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { Either, Left, Right } from 'purify-ts/Either';
import { Options, RangeSliderError } from './types';

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

function isArrayOfNumbers(v: unknown): v is [number, number] {
  return allPass([isArray, all(isNumber)])(v);
}

function isArrayOfBooleans(v: unknown): v is [boolean, boolean] {
  return allPass([isArray, all(isBoolean)])(v);
}

//
// ─── ERRORS ─────────────────────────────────────────────────────────────────────
//

const errorPrefix = 'RangeSlider/Options';

const ErrorNotValidValue = `${errorPrefix}/ErrorNotValidValue`;
const ErrorNotValidMin = `${errorPrefix}/ErrorNotValidMin`;
const ErrorNotValidMax = `${errorPrefix}/ErrorNotValidMax`;
const ErrorNotValidStep = `${errorPrefix}/ErrorNotValidStep`;
const ErrorNotValidOrientation = `${errorPrefix}/ErrorNotValidOrientation`;
const ErrorNotValidTooltips = `${errorPrefix}/ErrorNotValidTooltips`;
const ErrorNotValidTooltipsFormatter = `${errorPrefix}/ErrorNotValidTooltipsFormatter`;
const ErrorNotValidIntervals = `${errorPrefix}/ErrorNotValidIntervals`;
const ErrorNotValidGrid = `${errorPrefix}/ErrorNotValidGrid`;
const ErrorNotValidCSSClass = `${errorPrefix}/ErrorNotValidCSSClass`;
const ErrorOptionsIsNotAnObject = `${errorPrefix}/ErrorOptionsIsNotAnObject`;

function errNotValidValue(): RangeSliderError {
  return {
    id: ErrorNotValidValue,
    desc: `(value should be either number or array of numbers)`,
  };
}

function errNotValidMin(): RangeSliderError {
  return {
    id: ErrorNotValidMin,
    desc: `min should be a number)`,
  };
}

function errNotValidMax(): RangeSliderError {
  return {
    id: ErrorNotValidMax,
    desc: `(max should be a number)`,
  };
}

function errNotValidStep(): RangeSliderError {
  return {
    id: ErrorNotValidStep,
    desc: `(step should be a number)`,
  };
}

function errNotValidOrientation(): RangeSliderError {
  return {
    id: ErrorNotValidOrientation,
    desc: `(orientation should be one of: 'horizontal' or 'vertical')`,
  };
}

function errNotValidTooltips(): RangeSliderError {
  return {
    id: ErrorNotValidTooltips,
    desc: `(tooltips should be boolean or array of booleans)`,
  };
}

function errNotValidTooltipsFormatter(): RangeSliderError {
  return {
    id: ErrorNotValidTooltipsFormatter,
    desc: `(tooltipsFormatter should be a function that returns string`,
  };
}

function errNotValidIntervals(): RangeSliderError {
  return {
    id: ErrorNotValidIntervals,
    desc: `(intervals should be boolean or array of booleans)`,
  };
}

function errNotValidGrid(): RangeSliderError {
  return {
    id: ErrorNotValidGrid,
    desc: `(
      grid value should be a boolean or object with shape: {
        isVisible: boolean, numCells: number[]
      }
    )`,
  };
}

function errNotValidCSSClass(): RangeSliderError {
  return {
    id: ErrorNotValidCSSClass,
    desc: `(cssClass should start with letter & contain: letters, numbers, _ , -)`,
  };
}

function errOptionsIsNotAnObject(): RangeSliderError {
  return {
    id: ErrorOptionsIsNotAnObject,
    desc: `(options should be object)`,
  };
}

//
// ─── VALIDATORS ─────────────────────────────────────────────────────────────────
//

function checkValue(v: unknown): Maybe<RangeSliderError> {
  return anyPass([isNumber, isArrayOfNumbers])(v)
    ? Nothing
    : Just(errNotValidValue());
}

function checkMin(v: unknown): Maybe<RangeSliderError> {
  return isNumber(v) ? Nothing : Just(errNotValidMin());
}

function checkMax(v: unknown): Maybe<RangeSliderError> {
  return isNumber(v) ? Nothing : Just(errNotValidMax());
}

function checkStep(v: unknown): Maybe<RangeSliderError> {
  return isNumber(v) ? Nothing : Just(errNotValidStep());
}

function checkOrientation(v: unknown): Maybe<RangeSliderError> {
  return v === 'horizontal' || v === 'vertical'
    ? Nothing
    : Just(errNotValidOrientation());
}

function checkTooltips(v: unknown): Maybe<RangeSliderError> {
  return isBoolean(v) || isArrayOfBooleans(v)
    ? Nothing
    : Just(errNotValidTooltips());
}

function checkTooltipsFormatter(v: unknown): Maybe<RangeSliderError> {
  return isFunction(v) && isString(v(1))
    ? Nothing
    : Just(errNotValidTooltipsFormatter());
}

function checkIntervals(v: unknown): Maybe<RangeSliderError> {
  return isBoolean(v) || isArrayOfBooleans(v)
    ? Nothing
    : Just(errNotValidIntervals());
}

function checkGrid(v: unknown): Maybe<RangeSliderError> {
  const isValid = anyPass([
    isBoolean,
    allPass([
      isObject,
      where({
        isVisible: isBoolean,
        numCells: isArrayOfNumbers,
      }),
    ]),
  ])(v);

  return isValid ? Nothing : Just(errNotValidGrid());
}

function checkCSSClass(v: unknown): Maybe<RangeSliderError> {
  return isString(v) && /^[a-zA-Z]{1}[a-zA-Z0-9\-_]*/g.test(v)
    ? Nothing
    : Just(errNotValidCSSClass());
}

function checkRangeSliderOptions(
  v: unknown,
): Either<RangeSliderError[], Options> {
  if (isNotObject(v)) {
    return Left([errOptionsIsNotAnObject()]);
  }

  // pretend that v is RangeSliderOptions (for typings to work)
  const options = v as Options;

  const validationResults: Maybe<RangeSliderError>[] = [];
  validationResults.push(checkValue(options.value));
  validationResults.push(checkMin(options.min));
  validationResults.push(checkMax(options.max));
  validationResults.push(checkStep(options.step));
  validationResults.push(checkOrientation(options.orientation));
  validationResults.push(checkTooltips(options.tooltips));
  validationResults.push(checkTooltipsFormatter(options.tooltipFormatter));
  validationResults.push(checkIntervals(options.intervals));
  validationResults.push(checkGrid(options.grid));
  validationResults.push(checkCSSClass(options.cssClass));

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
  errNotValidTooltipsFormatter,
  errNotValidIntervals,
  errNotValidGrid,
  errNotValidCSSClass,
  errOptionsIsNotAnObject,
  // validators
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkTooltips,
  checkTooltipsFormatter,
  checkIntervals,
  checkGrid,
  checkCSSClass,
  checkRangeSliderOptions,
};
