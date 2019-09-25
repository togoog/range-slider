import {
  pipe,
  all,
  allPass,
  anyPass,
  test,
  trim,
  values,
} from 'ramda';
import {
  isArray,
  isObject,
  isNumber,
  isString,
  isBoolean,
  isPair,
  isNotEmpty,
} from 'ramda-adjunct';

function checkValue(v: unknown): v is RangeSliderOptions['value'] {
  return anyPass([
    isNumber,
    allPass([
      isArray,
      isNotEmpty,
      all(isNumber)
    ])
  ])(v);
}

function checkMin(v: unknown): v is RangeSliderOptions['min'] {
  return isNumber(v);
}

function checkMax(v: unknown): v is RangeSliderOptions['max'] {
  return isNumber(v);
}

function checkStep(v: unknown): v is RangeSliderOptions['step'] {
  return isNumber(v);
}

function checkOrientation(v: unknown): v is RangeSliderOptions['orientation'] {
  return allPass([
    isString,
    pipe(
      trim,
      test(/^(horizontal|vertical)$/g)
    )
  ])(v);
}

/**
 * Check string against locale pattern: aa-AA
 * @param v value to check
 */
function checkLocale(v: unknown): v is RangeSliderOptions['locale'] {
  return allPass([
    isString,
    pipe(
      trim,
      test(/^[a-z]{2}-[A-Z]{2}$/g)
    )
  ])(v);
}

function checkDirection(v: unknown): v is RangeSliderOptions['direction'] {
  return allPass([
    isString,
    pipe(
      trim,
      test(/^(ltr|rtl)$/g)
    )
  ])(v);
}

function checkPadding(v: unknown): v is RangeSliderOptions['padding'] {
  return anyPass([
    isNumber,
    allPass([
      isPair,
      all(isNumber)
    ])
  ])(v);
}

function checkIsDisabled(v: unknown): v is RangeSliderOptions['isDisabled'] {
  return isBoolean(v);
}

function checkIsPolyfill(v: unknown): v is RangeSliderOptions['isPolyfill'] {
  return isBoolean(v);
}

/**
 * cssPrefix should be string;
 * start with letter;
 * has length >= 1;
 * contain letters, numbers, -, _;
 * @param v value to check
 */
function checkCssPrefix(v: unknown): v is RangeSliderOptions['cssPrefix'] {
  return allPass([
    isString,
    pipe(
      trim,
      test(/^[a-zA-Z]+[a-zA-Z0-9\-_]*$/g)
    )
  ])(v);
}

function checkCssClasses(v: unknown): v is RangeSliderOptions['cssClasses'] {
  return allPass([
    isObject,
    pipe(
      values,
      all(
        allPass([
          isString,
          test(/^[a-zA-Z]+[a-zA-Z0-9\-_]*$/g),
        ])
      )
    )
  ])(v);
}

export {
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkLocale,
  checkDirection,
  checkPadding,
  checkIsDisabled,
  checkIsPolyfill,
  checkCssPrefix,
  checkCssClasses,
};