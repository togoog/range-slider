import { partialRight } from 'ramda';
import { Options } from '../../../src/types';
import { RangeSlider } from '../../../src/range-slider';
import { getOptionsFromConfigForm, getResultFromOptions } from '../../helpers';
import { renderConfigForm } from '../../components/config-form/config-form';
import {
  controlValue,
  controlMin,
  controlMax,
  controlStep,
  controlOrientation,
  controlTooltips,
  controlTooltipFormatter,
  controlIntervals,
  controlGrid,
  controlGridFormatter,
} from '../../components';

(function dateExample() {
  //
  // ─── HELPERS ────────────────────────────────────────────────────────────────────
  //

  function timestampToDate(timestamp: number, lang = 'ru-RU') {
    const date = new Date(timestamp);

    return date.toLocaleDateString(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function timestampToISOString(timestamp) {
    return new Date(timestamp).toISOString().substr(0, 10);
  }

  function dateToTimestamp(date: Date) {
    return date.valueOf();
  }

  function updateResultInput(options: Options, resultId: string) {
    const input = document.getElementById(resultId) as HTMLInputElement;
    const result = getResultFromOptions(options, timestampToISOString);

    input.value = result;
    // adjust input width to see the result
    input.style.width = `${result.length * 8}px`;
  }

  //
  // ─── INIT ───────────────────────────────────────────────────────────────────────
  //

  const step = 1 * 24 * 60 * 60 * 1000; // 1 day

  const elements = [
    partialRight(controlValue, [
      {
        type: 'date',
        valueFormatter: timestampToISOString,
        valueParser: Date.parse,
      },
    ]),
    partialRight(controlMin, [
      {
        type: 'date',
        valueFormatter: timestampToISOString,
        valueParser: Date.parse,
      },
    ]),
    partialRight(controlMax, [
      {
        type: 'date',
        valueFormatter: timestampToISOString,
        valueParser: Date.parse,
      },
    ]),
    partialRight(controlStep, [
      {
        type: 'number',
        valueFormatter: (timestamp: number) => timestamp / step,
        valueParser: (steps: number) => steps * step,
      },
    ]),
    controlOrientation,
    controlTooltips,
    controlTooltipFormatter,
    controlIntervals,
    controlGrid,
    controlGridFormatter,
  ];

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
    step,
    tooltips: true,
    tooltipFormatter: timestampToDate,
    intervals: false,
    grid: { isVisible: true, numCells: [4, 2, 5] },
    gridFormatter: timestampToDate,
  });

  const resultInput = document.getElementById(resultId) as HTMLInputElement;

  const configPanel = example.getElementsByClassName('config-panel').item(0);

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
    renderConfigForm(options, onFormUpdate, configPanel, elements);
    updateResultInput(options, resultId);
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

  renderConfigForm(rangeSlider.getAll(), onFormUpdate, configPanel, elements);
  updateResultInput(rangeSlider.getAll(), resultId);
})();
