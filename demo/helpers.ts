import { Options } from '../src/types';

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
  const serializedInput = form.getElementsByClassName(
    'js-options',
  )[0] as HTMLInputElement;

  return JSON.parse(serializedInput.value);
}

export {
  getRandomId,
  getFunctionBody,
  valueFormatter,
  getOptionsFromConfigForm,
};
