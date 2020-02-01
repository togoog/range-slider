import { partialRight } from 'ramda';
import Example from './example';
import {
  controlValue,
  controlMin,
  controlMax,
  controlStep,
  controlOrientation,
  controlTooltips,
  controlTooltipFormat,
  controlIntervals,
  controlGrid,
  controlGridFormat,
} from '../components';
import { Options } from '../../src/types';

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

const defaultYear = new Date().getFullYear();
const defaultStep = 1 * 24 * 60 * 60 * 1000; // 1 day

const defaultOptions: Options = {
  value: dateToTimestamp(new Date(defaultYear, 2, 3)),
  min: dateToTimestamp(new Date(defaultYear, 0, 1)),
  max: dateToTimestamp(new Date(defaultYear, 11, 31)),
  step: defaultStep,
  orientation: 'horizontal',
  cssClass: 'range-slider',
  tooltips: true,
  tooltipFormat: '%s',
  intervals: false,
  grid: { isVisible: true, numCells: [4, 2, 5] },
  gridFormat: '%s',
};

class ExampleDate extends Example {
  constructor(
    id: string,
    private year: number = defaultYear,
    private step: number = defaultStep,
    protected options: Options = defaultOptions,
  ) {
    super(id, options);
  }

  // eslint-disable-next-line class-methods-use-this
  getConfigPanelElements() {
    const { step } = this;

    return [
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
      controlTooltipFormat,
      controlIntervals,
      controlGrid,
      controlGridFormat,
    ];
  }
}

export default ExampleDate;
