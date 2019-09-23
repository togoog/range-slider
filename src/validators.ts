import { all, allPass, anyPass } from 'ramda';
import { isArray, isNumber, isNotEmpty } from 'ramda-adjunct';

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

export { checkValue, checkMin, checkMax, checkStep, checkOrientation };