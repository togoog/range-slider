import { createRangeSlider } from '../src/range-slider';
import { Options } from '../src/types';

const selector = '.range-slider-demo';
const options: Options = {
  value: [52, 160, 200, 345],
  min: -100,
  max: 500,
  step: 5,
  cssClass: 'range-slider',
  orientation: 'horizontal',
  tooltips: true,
  tooltipFormatter: (value: number) => value.toLocaleString(),
  intervals: [false, true, false, true, false],
};

const rsList = createRangeSlider(selector, options);
