import { render } from 'lit-html';
import { hasPath, path, assocPath, tryCatch } from 'ramda';
import { Options } from '../src/types';
import { toArray } from '../src/helpers';
import { RangeSlider } from '../src/range-slider';
import configForm from './components';
import { valueFormatter } from './helpers';

const example1 = document.getElementById('example-1');

const rsBasic = new RangeSlider(document.getElementById('rs-1'), {
  value: [300, 400],
  min: -100,
  max: 500,
  step: 5,
  tooltips: [true, true],
  intervals: [false, true, false],
  grid: true,
});

const rsBasicResult = document.getElementById(
  'rs-1-result',
) as HTMLInputElement;

const configPanel = example1.getElementsByClassName('config-panel').item(0);

function renderConfigForm(
  options: Options,
  onUpdate: Function,
  container: Element,
) {
  render(configForm(options, onUpdate), container);
}

function convertFormToOptions(form: HTMLFormElement): Options {
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

type UpdateOptionsProposal = (options: Options) => Options;

function onUpdate(e: MouseEvent, proposal?: UpdateOptionsProposal) {
  e.preventDefault();
  const inputElement = e.target as HTMLInputElement;
  let options = convertFormToOptions(inputElement.form);
  if (proposal) {
    options = proposal(options);
  }
  renderConfigForm(options, onUpdate, configPanel);
  rsBasic.set(options);
}

rsBasic.on('update', (options: Options) => {
  renderConfigForm(options, onUpdate, configPanel);

  const { value, step } = options;
  if (Array.isArray(value)) {
    rsBasicResult.value = value
      .map(v => (step === 0 ? valueFormatter(v) : v))
      .toString();
  } else {
    rsBasicResult.value = valueFormatter(value);
  }
});

rsBasicResult.addEventListener('input', (e: MouseEvent) => {
  const value = (e.target as HTMLInputElement).value.split(',').map(parseFloat);
  rsBasic.set({ value });
});

renderConfigForm(rsBasic.getAll(), onUpdate, configPanel);
