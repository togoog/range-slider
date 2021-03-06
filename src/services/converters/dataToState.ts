import { includes, prop, props, indexBy } from 'ramda';

import {
  Data,
  State,
  Track,
  Grid,
  GridCell,
  Handle,
  Tooltip,
  TooltipId,
  Interval,
} from '../../types';
import { createId, getRelativePosition } from '../../helpers';
import {
  tooltipNoIntervalConnector,
  tooltipSameIntervalConnector,
} from '../../defaults';
import formatValue from '../formatter';

/**
 * Create Handles state from model Data
 * @param data model Data
 */
function createHandlesState({
  min,
  max,
  orientation,
  cssClass,
  handlesStackOrder,
  handleDict,
  activeHandleIds,
}: Data): Handle[] {
  const role = 'handle';
  const handleCSSClass = `${cssClass}__${role}`;

  const handles = handlesStackOrder.map(
    (id): Handle => ({
      id,
      orientation,
      position: getRelativePosition(min, max, handleDict[id].value),
      isActive: activeHandleIds.includes(id),
      cssClass: handleCSSClass,
      role,
    }),
  );

  return handles;
}

/**
 * Create content from group of overlapping Tooltips
 * @param data model Data
 * @param tooltipsToMerge array of Tooltips
 */
function getMergedTooltipsContent(
  data: Data,
  ids: TooltipId[],
): Tooltip['content'] {
  const valueConnectorChain = ids
    .map((id): [string, string] => {
      const { handleId } = data.tooltipDict[id];
      const { value, rhsIntervalId } = data.handleDict[handleId];
      const isVisibleInterval = data.intervalDict[rhsIntervalId].isVisible;
      const formattedValue = formatValue(data.tooltipFormat, value);

      return [
        formattedValue,
        isVisibleInterval
          ? tooltipSameIntervalConnector
          : tooltipNoIntervalConnector,
      ];
    })
    .reduce((acc, cur, idx, arr): [string, string][] => {
      const nextValue = arr[idx + 1] ? arr[idx + 1][0] : null;

      if (cur[0] !== nextValue) {
        acc.push(cur);
      }

      return acc;
    }, [] as [string, string][]);

  if (data.orientation === 'vertical') {
    valueConnectorChain.reverse();
  }

  const lastPair = valueConnectorChain.pop();
  const lastValue = lastPair ? lastPair[0] : '';

  const result = valueConnectorChain
    .map(([value, connector]) =>
      connector === tooltipNoIntervalConnector
        ? `${value}${connector}`
        : `${value} ${connector}`,
    )
    .concat(lastValue)
    .join(' ');

  return result;
}

/**
 * Calculate merged Tooltip position
 * @param tooltips list of Tooltips
 */
function getMergedTooltipPosition(tooltips: Tooltip[]): Tooltip['position'] {
  const len = tooltips.length;
  const firstTooltipPosition = tooltips[0].position;
  const lastTooltipPosition = tooltips[len - 1].position;

  return (firstTooltipPosition + lastTooltipPosition) / 2;
}

/**
 * Create Tooltips state from model Data
 * @param data model Data
 */
function createTooltipsState(data: Data): Tooltip[] {
  const {
    min,
    max,
    orientation,
    cssClass,
    handleDict,
    tooltipIds,
    tooltipDict,
    tooltipCollisions,
    tooltipFormat,
  } = data;
  const role = 'tooltip';
  const tooltipCSSClass = `${cssClass}__${role}`;

  const tooltips = tooltipIds.map(
    (id): Tooltip => {
      const { handleId, isVisible } = tooltipDict[id];
      const { value } = handleDict[handleId];

      return {
        id,
        content: formatValue(tooltipFormat, value),
        orientation,
        cssClass: tooltipCSSClass,
        position: getRelativePosition(min, max, value),
        isVisible,
        hasCollisions: tooltipCollisions.some(includes(id)),
        role: 'tooltip',
      };
    },
  );

  const tooltipsDict = indexBy(prop('id'), tooltips);

  // when tooltips overlap - they are hidden
  // mergedTooltip is shown instead of group of overlapping tooltips
  const mergedTooltips = tooltipCollisions.map(
    (ids, idx): Tooltip => ({
      id: createId('tooltip-merged', idx),
      content: getMergedTooltipsContent(data, ids),
      orientation,
      hasCollisions: false,
      isVisible: true,
      position: getMergedTooltipPosition(props(ids, tooltipsDict)),
      cssClass: tooltipCSSClass,
      role: 'tooltip-merged',
    }),
  );

  return Object.values(tooltipsDict).concat(mergedTooltips);
}

/**
 * Create Intervals state from model Data
 * @param data model Data
 */
function createIntervalsState({
  min,
  max,
  orientation,
  cssClass,
  handleIds,
  handleDict,
  intervalIds,
  intervalDict,
}: Data): Interval[] {
  const role = 'interval';
  const intervalCSSClass = `${cssClass}__${role}`;

  const intervals = intervalIds.map(
    (id, idx): Interval => {
      const { lhsHandleId, rhsHandleId } = intervalDict[id];
      return {
        id,
        from:
          idx > 0 && lhsHandleId
            ? getRelativePosition(min, max, handleDict[lhsHandleId].value)
            : 0,
        to:
          idx < handleIds.length && rhsHandleId
            ? getRelativePosition(min, max, handleDict[rhsHandleId].value)
            : 100,
        cssClass: intervalCSSClass,
        orientation,
        isVisible: intervalDict[id].isVisible,
        role: 'interval',
      };
    },
  );

  return intervals;
}

// TODO: Make it recursive to create cells inside big cell and cells inside medium cell
// eslint-disable-next-line complexity
function createGridCellsState({
  min,
  max,
  orientation,
  cssClass,
  grid,
  gridFormat: gridFormatter,
}: Data): GridCell[] {
  if (min === max) {
    // no point in creating grid
    return [];
  }

  const { numCells } = grid;
  const rangeSize = Math.abs(max - min);
  const cells: { [position: number]: GridCell } = {};
  const role = 'grid-cell';
  const gridCellCSSClass = `${cssClass}__${role}`;

  let totalCells = 1;
  for (let i = 0; i < numCells.length; i += 1) {
    if (numCells[i] > 0) {
      totalCells *= numCells[i];
      const cellSize = rangeSize / totalCells;
      for (let j = 0; j <= totalCells; j += 1) {
        const value = min + cellSize * j;
        const position = parseFloat(
          (((j * cellSize) / rangeSize) * 100).toFixed(2),
        );

        if (cells[position] === undefined) {
          cells[position] = {
            label: formatValue(gridFormatter, value),
            isVisibleLabel: i === 0,
            level: i + 1,
            orientation,
            cssClass: gridCellCSSClass,
            position,
            role,
          };
        }
      }
    }
  }

  return Object.keys(cells)
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .map((key: string) => cells[parseFloat(key)]);
}

/**
 * Create Grid state from model Data
 * @param param0 model Data
 */
function createGridState(data: Data): Grid {
  const { min, max, cssClass, orientation, grid } = data;
  return {
    min,
    max,
    orientation,
    isVisible: grid.isVisible,
    cssClass: `${cssClass}__grid`,
    cells: createGridCellsState(data),
    role: 'grid',
  };
}

/**
 * Create Track state from model Data
 * @param param0 model Data
 */
function createTrackState({ orientation, cssClass }: Data): Track {
  return {
    orientation,
    cssClass: `${cssClass}__track`,
    role: 'track',
  };
}

function convertDataToState(data: Data): State {
  return {
    cssClass: data.cssClass,
    track: createTrackState(data),
    grid: createGridState(data),
    intervals: createIntervalsState(data),
    handles: createHandlesState(data),
    tooltips: createTooltipsState(data),
  };
}

export default convertDataToState;
