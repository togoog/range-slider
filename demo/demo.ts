import { createRangeSlider } from '../src/range-slider';

const rsHorizontal = createRangeSlider('#range-slider-horizontal', {
  value: [52, 160, 200, 345],
  min: -100,
  max: 500,
  step: 5,
  cssClass: 'range-slider',
  orientation: 'horizontal',
  tooltips: true,
  tooltipFormatter: (value: number) => value.toLocaleString(),
  intervals: [false, true, false, true, false],
  grid: { isVisible: true, numCells: [5, 4, 3] },
});

const rsVertical = createRangeSlider('#range-slider-vertical', {
  value: [52, 160, 200, 345],
  min: -100,
  max: 500,
  step: 5,
  cssClass: 'range-slider',
  orientation: 'vertical',
  tooltips: true,
  tooltipFormatter: (value: number) => value.toLocaleString(),
  intervals: [false, true, false, true, false],
  grid: { isVisible: true, numCells: [5, 4, 3] },
});
