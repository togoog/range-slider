import { aperture } from 'ramda';
import { Options } from '../src/types';
import { prepareOptionsForInternalUse } from '../src/services/converters/optionsToData';
import formatValue from '../src/services/formatter';

function getRandomId(prefix: string) {
  return `${prefix}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

function valueFormatter(value: number): string {
  return formatValue('%d', value);
}

function getOptionsFromConfigForm(form: HTMLFormElement): Options {
  const serializedInput = form.getElementsByClassName(
    'js-options',
  )[0] as HTMLInputElement;

  return JSON.parse(serializedInput.value);
}

function getResultFromOptions(options: Options): string {
  const {
    value,
    intervals,
    min,
    max,
    tooltipFormat,
  } = prepareOptionsForInternalUse(options);

  const isConnected = (idx: number) => intervals[idx];
  const isNotConnected = (idx: number) => !isConnected(idx);
  const allValues = [min, ...value, max].map(v =>
    formatValue(tooltipFormat, v),
  );
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
  valueFormatter,
  getOptionsFromConfigForm,
  getResultFromOptions,
};
