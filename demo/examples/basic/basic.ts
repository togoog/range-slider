import { aperture } from 'ramda';
import { Options } from '../../../src/types';
import defaultOptions from './defaults';
import { RangeSlider } from '../../../src/range-slider';
import { getOptionsFromConfigForm, getResultFromOptions } from '../../helpers';
import { prepareOptionsForInternalUse } from '../../../src/converters/optionsToData';
import { renderConfigForm } from '../../components/config-form/config-form';

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

  function updateResultInput(options: Options, resultId: string) {
    const input = document.getElementById(resultId) as HTMLInputElement;
    const result = getResultFromOptions(options);

    input.value = result;
    // adjust input width to see the result
    input.style.width = `${result.length * 8}px`;
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
    updateResultInput(options, resultId);
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
  updateResultInput(rangeSlider.getAll(), resultId);
})();
