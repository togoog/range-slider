import { partialRight } from 'ramda';
import moment from 'moment';
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

function timestampToISOString(timestamp) {
  return moment
    .unix(timestamp)
    .toISOString()
    .substr(0, 10);
}

function isoStringToTimestamp(isoString: string) {
  return moment(isoString).unix();
}

function dateToTimestamp(date: Date) {
  return moment(date).unix();
}

const currentYear = new Date().getFullYear();
const oneDay = moment.duration(1, 'day').asSeconds();

const defaultOptions: Options = {
  value: dateToTimestamp(new Date(currentYear, 2, 3)),
  min: dateToTimestamp(new Date(currentYear, 0, 1)),
  max: dateToTimestamp(new Date(currentYear, 11, 31)),
  step: oneDay,
  orientation: 'horizontal',
  cssClass: 'range-slider',
  tooltips: true,
  tooltipFormat: '{{date}}',
  intervals: false,
  grid: { isVisible: true, numCells: [4, 2, 5] },
  gridFormat: '{{date}}',
};

class ExampleDate extends Example {
  constructor(id: string, protected options: Options = defaultOptions) {
    super(id, options);
  }

  // eslint-disable-next-line class-methods-use-this
  getConfigPanelElements() {
    return [
      partialRight(controlValue, [
        {
          type: 'date',
          valueFormatter: timestampToISOString,
          valueParser: isoStringToTimestamp,
        },
      ]),
      partialRight(controlMin, [
        {
          type: 'date',
          valueFormatter: timestampToISOString,
          valueParser: isoStringToTimestamp,
        },
      ]),
      partialRight(controlMax, [
        {
          type: 'date',
          valueFormatter: timestampToISOString,
          valueParser: isoStringToTimestamp,
        },
      ]),
      partialRight(controlStep, [
        {
          type: 'number',
          valueFormatter: (timestamp: number) => timestamp / oneDay,
          valueParser: (steps: number) => steps * oneDay,
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
