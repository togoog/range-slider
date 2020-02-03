import { partialRight } from 'ramda';
import { sprintf } from 'sprintf-js';
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
import Example from './example';

class ExampleFractions extends Example {
  // eslint-disable-next-line class-methods-use-this
  getConfigPanelElements() {
    return [
      partialRight(controlValue, [
        {
          type: 'number',
          valueFormatter: (v: number) => sprintf('%.1f', v),
          valueParser: parseFloat,
        },
      ]),
      partialRight(controlMin, [
        {
          type: 'number',
          valueFormatter: (v: number) => sprintf('%.1f', v),
          valueParser: parseFloat,
        },
      ]),
      partialRight(controlMax, [
        {
          type: 'number',
          valueFormatter: (v: number) => sprintf('%.1f', v),
          valueParser: parseFloat,
        },
      ]),
      partialRight(controlStep, [
        {
          type: 'number',
          valueFormatter: (v: number) => sprintf('%.1f', v),
          valueParser: parseFloat,
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

export default ExampleFractions;
