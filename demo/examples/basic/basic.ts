import { render } from 'lit-html';
import { Options } from '../../../src/types';
import defaultOptions from './defaults';
import { RangeSlider } from '../../../src/range-slider';
import { OnConfigFormUpdate } from '../../types';
import { getOptionsFromConfigForm } from '../../helpers';
import configForm from './basic-config-form';

(function basicExample() {
  //
  // ─── INIT ───────────────────────────────────────────────────────────────────────
  //

  const baseId = 'basic';
  const exampleId = `${baseId}-example`;
  const targetId = `${baseId}-target`;
  const resultId = `${baseId}-result`;

  const example = document.getElementById(exampleId);

  const rangeSlider = new RangeSlider(
    document.getElementById(targetId),
    defaultOptions,
  );

  const result = document.getElementById(resultId) as HTMLInputElement;

  const configPanel = example.getElementsByClassName('config-panel').item(0);

  //
  // ─── HELPERS ────────────────────────────────────────────────────────────────────
  //

  function valueFormatter(value: Options['value']) {
    const precision = 2;

    if (Array.isArray(value)) {
      return value.map(v => v.toFixed(precision)).join(', ');
    }

    return value.toFixed(precision);
  }

  function renderConfigForm(
    options: Options,
    onUpdate: OnConfigFormUpdate,
    container: Element,
  ) {
    render(configForm({ options, onUpdate }), container);
  }

  function updateResultInput(value: Options['value'], resultId: string) {
    const input = document.getElementById(resultId) as HTMLInputElement;

    if (!input) {
      console.error('Can not find Result input');
    }

    input.value = valueFormatter(value);
  }

  //
  // ─── EVENT HANDLERS ─────────────────────────────────────────────────────────────
  //

  function onFormUpdate(
    e: MouseEvent,
    proposal?: (options: Options) => Options,
  ) {
    e.preventDefault();
    const inputElement = e.target as HTMLInputElement;

    let options = getOptionsFromConfigForm(inputElement.form);
    if (proposal) {
      options = proposal(options);
    }

    rangeSlider.set(options);
  }

  //
  // ─── EVENT LISTENERS ────────────────────────────────────────────────────────────
  //

  rangeSlider.on('update', (options: Options) => {
    renderConfigForm(options, onFormUpdate, configPanel);
    updateResultInput(options.value, resultId);
  });

  result.addEventListener('change', (e: MouseEvent) => {
    const value = (e.target as HTMLInputElement).value
      .split(',')
      .map(parseFloat);
    rangeSlider.set({ value });
  });

  //
  // ─── RUN EXAMPLE ────────────────────────────────────────────────────────────────
  //

  renderConfigForm(rangeSlider.getAll(), onFormUpdate, configPanel);
  updateResultInput(rangeSlider.getAll().value, resultId);
})();
