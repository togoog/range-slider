import { Options } from '../../../src/types';
import { RangeSlider } from '../../../src/range-slider';
import { valueFormatter, getOptionsFromConfigForm } from '../../helpers';
import { renderConfigForm } from '../../components/config-form/config-form';

(function dateExample() {
  //
  // ─── HELPERS ────────────────────────────────────────────────────────────────────
  //

  function renderResult(options: Options, input: HTMLInputElement) {
    const { value, step } = options;
    if (Array.isArray(value)) {
      // eslint-disable-next-line no-param-reassign
      input.value = value
        .map(v => (step === 0 ? valueFormatter(v) : v))
        .toString();
    } else {
      // eslint-disable-next-line no-param-reassign
      input.value = valueFormatter(value);
    }
  }

  function timestampToDate(timestamp: number, lang = 'ru-RU') {
    const date = new Date(timestamp);

    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function dateToTimestamp(date: Date) {
    return date.valueOf();
  }

  //
  // ─── INIT ───────────────────────────────────────────────────────────────────────
  //

  const year = new Date().getFullYear();

  const baseId = 'date';
  const exampleId = `${baseId}-example`;
  const targetId = `${baseId}-target`;
  const resultId = `${baseId}-result`;

  const example = document.getElementById(exampleId);

  const rangeSlider = new RangeSlider(document.getElementById(targetId), {
    value: dateToTimestamp(new Date(year, 2, 3)),
    min: dateToTimestamp(new Date(year, 0, 1)),
    max: dateToTimestamp(new Date(year, 11, 31)),
    step: 1 * 24 * 60 * 60 * 1000, // 1 day
    tooltips: true,
    tooltipFormatter: timestampToDate,
    intervals: false,
    grid: { isVisible: true, numCells: [4, 2, 5] },
  });

  const resultInput = document.getElementById(resultId) as HTMLInputElement;

  const configPanel = example.getElementsByClassName('config-panel').item(0);

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
    renderResult(options, resultInput);
  });

  resultInput.addEventListener('change', (e: MouseEvent) => {
    const value = (e.target as HTMLInputElement).value
      .split(',')
      .map(parseFloat);
    rangeSlider.set({ value });
  });

  //
  // ─── RUN EXAMPLE ────────────────────────────────────────────────────────────────
  //

  renderConfigForm(rangeSlider.getAll(), onConfigFormUpdate, configPanel);
  renderResult(rangeSlider.getAll(), resultInput);
})();
