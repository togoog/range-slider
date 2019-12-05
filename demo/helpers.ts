import { path, assocPath, hasPath, tryCatch } from 'ramda';
import { Options } from '../src/types';
import { toArray } from '../src/helpers';

function getRandomId(prefix: string) {
  return `${prefix}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

function getFunctionBody(fn: Function): string {
  return fn
    .toString()
    .match(/function[^{]+\{([\s\S]*)\}$/)[1]
    .trim();
}

function valueFormatter(value: number): string {
  return value.toFixed(3);
}

function getOptionsFromConfigForm(form: HTMLFormElement): Options {
  return [...form.elements]
    .map((input: HTMLInputElement) => {
      if (['checkbox', 'radio'].includes(input.type)) {
        return {
          name: input.name,
          value: input.checked,
        };
      }

      return {
        name: input.name,
        value: input.value,
      };
    })
    .filter(({ name }) => name.length > 0)
    .reduce((acc, cur) => {
      const { name, value } = cur;
      const nested = name.split('.');
      let parsedValue = tryCatch(JSON.parse, () => value)(value);
      if (name === 'tooltipFormatter') {
        // eslint-disable-next-line no-new-func
        parsedValue = new Function('value', parsedValue);
      }
      if (hasPath(nested, acc)) {
        const oldValue = toArray(path(nested, acc));
        return assocPath(nested, [...oldValue, parsedValue], acc);
      }
      return assocPath(nested, parsedValue, acc);
    }, {}) as Options;
}

export {
  getRandomId,
  getFunctionBody,
  valueFormatter,
  getOptionsFromConfigForm,
};
