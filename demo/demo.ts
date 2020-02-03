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
