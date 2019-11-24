import * as fc from 'fast-check';
import { prop } from 'ramda';
import { makeState } from '../arbitraries';
import View from '../../mvp/view';

const cssClass = `range-slider`;
const trackCSSClass = `${cssClass}__track`;
const gridCSSClass = `${cssClass}__grid`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

describe('View.render', () => {
  document.body.innerHTML = '<div id="root"></div>';
  const el = document.querySelector('#root');
  const view = new View(el as HTMLElement);

  test('should render components according to provided State', () => {
    fc.assert(
      fc.property(makeState(), state => {
        // Track
        view.render(state);
        const track = document.getElementsByClassName(trackCSSClass);
        expect(track).toHaveLength(1);

        // Grid
        const grid = document.getElementsByClassName(gridCSSClass);
        if (state.grid.isVisible) {
          expect(grid).toHaveLength(1);
        } else {
          expect(grid).toHaveLength(0);
        }

        // Intervals
        const intervals = document.getElementsByClassName(intervalCSSClass);
        expect(intervals).toHaveLength(
          state.intervals.filter(prop('isVisible')).length,
        );

        // Handles
        const handles = document.getElementsByClassName(handleCSSClass);
        expect(handles).toHaveLength(state.handles.length);

        // Tooltips
        const tooltips = document.getElementsByClassName(tooltipCSSClass);
        expect(tooltips).toHaveLength(
          state.tooltips.filter(prop('isVisible')).length,
        );
      }),
      { numRuns: 10 },
    );
  });
});
