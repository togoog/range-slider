import { all, allPass, anyPass, test } from 'ramda';
import {
  isArray,
  isNumber,
  isString,
  isBoolean,
  isPair,
  isNotEmpty
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
    test(/\s*(horizontal|vertical)\s*/g)
  ])(v);
}

/**
 * Check string against locale pattern: aa-AA
 * @param v value to check
 */
function checkLocale(v: unknown): v is RangeSliderOptions['locale'] {
  return allPass([
    isString,
    test(/\s*[a-z]{2}-[A-Z]{2}\s*/g)
  ])(v);
}

function checkDirection(v: unknown): v is RangeSliderOptions['direction'] {
  return allPass([
    isString,
    test(/\s*(ltr|rtl)\s*/g)
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

export {
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkLocale,
  checkDirection,
  checkPadding,
  checkIsDisabled
};