import * as fc from 'fast-check';
import { prop } from 'ramda';
import { makeState } from '../arbitraries';
import { View } from '../../mvp';
import { convertOrientationToOrigin } from '../../services/converters';

const intervalCSSClass = 'range-slider__interval';

test('Interval', () => {
  document.body.innerHTML = '<div id="root"></div>';
  const el = document.querySelector('#root');
  const view = new View(el as HTMLElement);

  fc.assert(
    fc.property(makeState(), state => {
      // should position interval relative to beginning of track
      view.render(state);
      const intervalElements = document.getElementsByClassName(
        intervalCSSClass,
      );
      state.intervals
        .filter(prop('isVisible'))
        .forEach(({ from, to, orientation }, idx) => {
          const origin = convertOrientationToOrigin(orientation);
          const dimension = orientation === 'horizontal' ? 'width' : 'height';

          const originValue = window.getComputedStyle(intervalElements[idx])[
            origin
          ];
          const dimensionValue = window.getComputedStyle(intervalElements[idx])[
            dimension
          ];

          expect(originValue).toBe(`${from}%`);
          expect(dimensionValue).toBe(`${to - from}%`);
        });
    }),
    { numRuns: 10 },
  );
});
