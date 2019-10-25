import { createRangeSlider } from '../src/range-slider';
import { Options } from '../src/types';

const selector = '.range-slider-demo';
const options: Options = {
  value: [55, 60],
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: true,
  intervals: [false, true, false],
};

const rsList = createRangeSlider(selector, options);
console.log(rsList);
