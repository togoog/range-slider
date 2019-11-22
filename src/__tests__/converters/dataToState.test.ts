import * as fc from 'fast-check';
import { convertDataToState } from '../../converters';
import { makeData } from '../arbitraries';
import { getRelativePosition } from '../../helpers';

test('convertDataToState', () => {
  fc.assert(
    fc.property(makeData(), data => {
      const state = convertDataToState(data);

      expect(state.cssClass).toEqual(data.cssClass);

      // Track
      expect(state.track.cssClass).toEqual(`${data.cssClass}__track`);
      expect(state.track.orientation).toEqual(data.orientation);

      // Grid
      expect(state.grid.orientation).toEqual(data.orientation);
      expect(state.grid.min).toEqual(data.min);
      expect(state.grid.max).toEqual(data.max);
      expect(state.grid.isVisible).toEqual(data.grid.isVisible);
      expect(state.grid.cssClass).toEqual(`${data.cssClass}__grid`);

      // Handles
      expect(state.handles.length).toEqual(data.handleIds.length);
      state.handles.map(handle => {
        expect(handle.cssClass).toEqual(`${data.cssClass}__handle`);
        expect(handle.isActive).toEqual(data.activeHandleId === handle.id);
        expect(handle.orientation).toEqual(data.orientation);
        expect(handle.position).toEqual(
          getRelativePosition(
            data.min,
            data.max,
            data.handleDict[handle.id].value,
          ),
        );
      });

      // Tooltips
      expect(state.tooltips.length).toEqual(data.tooltipIds.length);
      state.tooltips.map(tooltip => {
        expect(tooltip.cssClass).toEqual(`${data.cssClass}__tooltip`);
        expect(tooltip.hasCollisions).toEqual(
          data.tooltipCollisions.flat().some(id => tooltip.id === id),
        );
        expect(tooltip.isVisible).toEqual(
          data.tooltipDict[tooltip.id].isVisible,
        );
        expect(tooltip.orientation).toEqual(data.orientation);
        expect(tooltip.position).toEqual(
          getRelativePosition(
            data.min,
            data.max,
            data.handleDict[data.tooltipDict[tooltip.id].handleId].value,
          ),
        );
        expect(tooltip.content).toEqual(
          data.tooltipFormatter(
            data.handleDict[data.tooltipDict[tooltip.id].handleId].value,
          ),
        );
      });

      // Intervals
      expect(state.intervals.length).toEqual(data.intervalIds.length);
      state.intervals.map(interval => {
        const { lhsHandleId, rhsHandleId } = data.intervalDict[interval.id];

        expect(interval.cssClass).toEqual(`${data.cssClass}__interval`);
        expect(interval.isVisible).toEqual(
          data.intervalDict[interval.id].isVisible,
        );
        expect(interval.orientation).toEqual(data.orientation);
        expect(interval.from).toEqual(
          lhsHandleId === null
            ? 0
            : getRelativePosition(
                data.min,
                data.max,
                data.handleDict[lhsHandleId].value,
              ),
        );
        expect(interval.to).toEqual(
          rhsHandleId === null
            ? 100
            : getRelativePosition(
                data.min,
                data.max,
                data.handleDict[rhsHandleId].value,
              ),
        );
      });
    }),
  );
});
