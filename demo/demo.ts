import $ from 'jquery';
import '../src/jq-range-slider';

import Example from './examples/example';
import ExampleDate from './examples/example-date';
import ExampleFraction from './examples/example-fraction';

//
// ─── WORKING WITH NUMBERS ───────────────────────────────────────────────────────
//

const baseExample = new Example('base-example');

//
// ─── WORKING WITH DATE ──────────────────────────────────────────────────────────
//

const dateExample = new ExampleDate('date-example');

//
// ─── WORKING WITH FRACTIONS ─────────────────────────────────────────────────────
//

const fractionsExample = new ExampleFraction('fraction-example', {
  step: 1.5,
  tooltipFormat: '{{number(%.1f)}}',
  gridFormat: '{{number(%.1f)}}',
});

//
// ─── WORKING WITH NEGATIVE NUMBERS ──────────────────────────────────────────────
//

const negativeNumbers = new Example('negative-numbers-example', {
  min: -1000,
  max: 1000,
  value: 100,
  step: 10,
  grid: {
    isVisible: true,
    numCells: [5, 4, 3],
  },
});

//
// ─── INIT WITH JQUERY ───────────────────────────────────────────────────────────
//

$('.jq-example').rangeSlider();
