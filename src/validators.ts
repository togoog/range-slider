import { all, allPass, anyPass, test } from 'ramda';
import { isArray, isNumber, isString, isNotEmpty } from 'ramda-adjunct';

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
  return v === 'horizontal' || v === 'vertical';
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

export {
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkLocale
};