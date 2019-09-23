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

export { checkValue };