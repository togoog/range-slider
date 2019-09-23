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

export { checkValue, checkMin };