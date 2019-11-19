import { fromPairs, includes, zip, props, aperture } from 'ramda';
import {
  RelativePos,
  Data,
  State,
  Handle,
  HandleId,
  Tooltip,
  Interval,
  TooltipId,
} from '../types';
import { createId, getRelativePosition } from '../helpers';

function createHandles(data: Data): Handle[] {
  const role = 'handle';
  const cssClass = `${data.cssClass}__${role}`;

  const handles = data.handleIds.map(
    (id): Handle => ({
      id,
      orientation: data.orientation,
      position: getRelativePosition(data.min, data.max, data.handles[id]),
      isActive: data.activeHandleId === id,
      cssClass,
      role,
    }),
  );

  return handles;
}

function getMergedTooltipsContent(
  data: Data,
  tooltipsToMerge: Tooltip[],
): Tooltip['content'] {
  // if 2 adjacent values belong to visible interval -> connect them with dash (-)
  // otherwise connect them with semicolon (;)
  const valuesWithConnectors = tooltipsToMerge
    .reduce(
      (acc, cur): HandleId[] => acc.concat(cur.handleIds),
      [] as HandleId[],
    )
    .map(handleId => ({
      handleIdx: data.handleIds.findIndex(id => id === handleId),
      value: data.handles[handleId],
    }))
    .reduce((acc, cur, idx, arr): { handleIdx: number; value: number }[] => {
      const nextVal = arr[idx + 1] ? arr[idx + 1].value : null;

      if (nextVal !== cur.value) {
        acc.push(cur);
      }

      return acc;
    }, [] as { handleIdx: number; value: number }[])
    .flatMap(({ handleIdx, value }) => {
      const intervalId = data.intervalIds[handleIdx + 1];
      const formatedValue = data.tooltipFormatter(value);

      if (data.intervals[intervalId]) {
        return [formatedValue, ' - '];
      }

      return [formatedValue, '; '];
    });

  // remove last connector
  valuesWithConnectors.pop();

  return valuesWithConnectors.join('');
}

function getMergedTooltipPosition(
  tooltipsToMerge: Tooltip[],
): Tooltip['position'] {
  const len = tooltipsToMerge.length;
  const firstTooltipPosition = tooltipsToMerge[0].position;
  const lastTooltipPosition = tooltipsToMerge[len - 1].position;

  return (firstTooltipPosition + lastTooltipPosition) / 2;
}

function createTooltips(data: Data): Tooltip[] {
  const role = 'tooltip';
  const cssClass = `${data.cssClass}__${role}`;

  const tooltipPairs = zip(data.handleIds, data.tooltipIds).map(
    ([handleId, tooltipId]): [TooltipId, Tooltip] => [
      tooltipId,
      {
        id: tooltipId,
        handleIds: [handleId],
        content: data.tooltipFormatter(data.handles[handleId]),
        orientation: data.orientation,
        hasCollisions: data.tooltipCollisions.some(includes(tooltipId)),
        isVisible: data.tooltips[tooltipId],
        position: getRelativePosition(
          data.min,
          data.max,
          data.handles[handleId],
        ),
        cssClass,
        role: 'tooltip',
      },
    ],
  );

  const tooltipsMap = fromPairs(tooltipPairs);

  // when tooltips overlap - they are hidden
  // mergedTooltip is shown instead of group of overlapping tooltips

  const mergedTooltips = data.tooltipCollisions.map(
    (group, idx): Tooltip => ({
      id: createId('tooltip-merged', idx),
      handleIds: group.reduce(
        (acc, tooltipId) => acc.concat(tooltipsMap[tooltipId].handleIds),
        [] as HandleId[],
      ),
      content: getMergedTooltipsContent(data, props(group, tooltipsMap)),
      orientation: data.orientation,
      hasCollisions: false,
      isVisible: true,
      position: getMergedTooltipPosition(props(group, tooltipsMap)),
      cssClass,
      role: 'tooltip-merged',
    }),
  );

  return Object.values(tooltipsMap).concat(mergedTooltips);
}

function createIntervals(data: Data): Interval[] {
  const role = 'interval';
  const cssClass = `${data.cssClass}__${role}`;

  const handlePositions = data.handleIds.map((handleId): {
    id: HandleId;
    pos: RelativePos;
  } => ({
    id: handleId,
    pos: getRelativePosition(data.min, data.max, data.handles[handleId]),
  }));

  const allRelativePositions = [
    { id: 'first', pos: 0 },
    ...handlePositions,
    { id: 'last', pos: 100 },
  ];

  const intervals = zip(
    data.intervalIds,
    aperture(2, allRelativePositions),
  ).map(
    ([id, [start, stop]]): Interval => ({
      id,
      from: start.pos,
      to: stop.pos,
      handleIds: [start.id, stop.id],
      orientation: data.orientation,
      cssClass,
      isVisible: data.intervals[id],
      role,
    }),
  );

  return intervals;
}

function convertDataToState(data: Data): State {
  return {
    cssClass: data.cssClass,
    track: {
      orientation: data.orientation,
      cssClass: `${data.cssClass}__track`,
    },
    grid: {
      isVisible: data.grid.isVisible,
      orientation: data.orientation,
      cssClass: `${data.cssClass}__grid`,
      numCells: data.grid.numCells,
      min: data.min,
      max: data.max,
    },
    intervals: createIntervals(data),
    handles: createHandles(data),
    tooltips: createTooltips(data),
  };
}

export default convertDataToState;
