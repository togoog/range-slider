import { RangeSliderError } from './types';

const ErrorNotANumber = 'RangeSlider/ErrorNotANumber';
const ErrorNotOneOf = 'RangeSlider/ErrorNotOneOf';
const ErrorIncorrectObjectShape = 'RangeSlider/ErrorIncorrectObjectShape';

// function err(s: { id: string; desc: string }): Error {
//   return new Error(JSON.stringify(s));
// }

function errNotANumber(varName = '', v: unknown): RangeSliderError {
  const desc = `
    ${varName} should be a number, 
    but ${typeof v} given instead
  `.trim();

  return { id: ErrorNotANumber, desc };
}

function errNotOneOf(
  varName = '',
  possibleValues: unknown[],
  v: unknown,
): RangeSliderError {
  const desc = `
      ${varName} should be one of: ${possibleValues.join(', ')}, 
      but ${v} given instead
    `.trim();

  return { id: ErrorNotOneOf, desc };
}

function errIncorrectObjectShape(
  varName = '',
  keys: string[],
): RangeSliderError {
  const desc = `
    ${varName} should be an object with keys:
    ${keys.join(', ')}
  `.trim();

  return { id: ErrorIncorrectObjectShape, desc };
}

export { errNotANumber, errNotOneOf, errIncorrectObjectShape };
