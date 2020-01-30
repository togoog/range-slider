import { aperture } from 'ramda';
import { Options, Formatter } from '../src/types';
import { prepareOptionsForInternalUse } from '../src/services/converters/optionsToData';

function getRandomId(prefix: string) {
  return `${prefix}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

function getFunctionAsText(fn: Function): string {
  return fn.toString().trim();
}

function valueFormatter(value: number): string {
  return value.toFixed(1);
}

function getOptionsFromConfigForm(form: HTMLFormElement): Options {
  const serializedInput = form.getElementsByClassName(
    'js-options',
  )[0] as HTMLInputElement;

  return JSON.parse(serializedInput.value);
}

function getResultFromOptions(
  options: Options,
  format: Formatter = valueFormatter,
): string {
  const { value, intervals, min, max } = prepareOptionsForInternalUse(options);

  const isConnected = (idx: number) => intervals[idx];
  const isNotConnected = (idx: number) => !isConnected(idx);
  const allValues = [min, ...value, max].map(format);
  const valuePairs = aperture(2, allValues);

  const result = valuePairs
    .reduce((acc, valuePair, idx) => {
      if (isConnected(idx)) {
        return acc.concat(valuePair.join('..'));
      }

      if (isNotConnected(idx + 1) && idx + 1 < valuePairs.length) {
        return acc.concat(valuePair[1]);
      }

      return acc;
    }, [])
    .join('; ');

  return result;
}

export {
  getRandomId,
  getFunctionAsText,
  valueFormatter,
  getOptionsFromConfigForm,
  getResultFromOptions,
};
