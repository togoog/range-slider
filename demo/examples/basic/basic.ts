import { render } from 'lit-html';
import { Options } from '../../../src/types';
import { RangeSlider } from '../../../src/range-slider';
import configForm from '../../components';
import { valueFormatter, getOptionsFromConfigForm } from '../../helpers';

(function basicExample() {
  //
  // ─── INIT ───────────────────────────────────────────────────────────────────────
  //

  const baseId = 'basic';
  const exampleId = `${baseId}-example`;
  const targetId = `${baseId}-target`;
  const resultId = `${baseId}-result`;

  const example = document.getElementById(exampleId);

  const rangeSlider = new RangeSlider(document.getElementById(targetId), {
    value: 500,
    min: -1000,
    max: 1000,
    step: 10,
    tooltips: true,
    intervals: false,
    grid: { isVisible: true, numCells: [4, 2, 5] },
  });

  const result = document.getElementById(resultId) as HTMLInputElement;

  const configPanel = example.getElementsByClassName('config-panel').item(0);

  //
  // ─── HELPERS ────────────────────────────────────────────────────────────────────
  //

  function renderConfigForm(
    options: Options,
    onUpdate: Function,
    container: Element,
  ) {
    render(configForm(options, onUpdate), container);
  }

  function renderResult(options: Options) {
    const { value, step } = options;
    if (Array.isArray(value)) {
      result.value = value
        .map(v => (step === 0 ? valueFormatter(v) : v))
        .toString();
    } else {
      result.value = valueFormatter(value);
    }
  }

  //
  // ─── EVENT HANDLERS ─────────────────────────────────────────────────────────────
  //

  function onConfigFormUpdate(
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
    renderConfigForm(options, onConfigFormUpdate, configPanel);
    renderResult(options);
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

  renderConfigForm(rangeSlider.getAll(), onConfigFormUpdate, configPanel);
  renderResult(rangeSlider.getAll());
})();
