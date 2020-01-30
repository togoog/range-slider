import { Data, Options } from '../../types';

/**
 * Convert model Data to user Options
 * @param param0 model Data
 */
function convertDataToOptions({
  min,
  max,
  step,
  orientation,
  cssClass,
  handleIds,
  handleDict,
  tooltipIds,
  tooltipDict,
  tooltipFormatter,
  intervalIds,
  intervalDict,
  grid,
  gridFormatter,
}: Data): Options {
  return {
    value: handleIds.map(id => handleDict[id].value),
    min,
    max,
    step,
    orientation,
    cssClass,
    tooltips: tooltipIds.map(id => tooltipDict[id].isVisible),
    tooltipFormatter,
    intervals: intervalIds.map(id => intervalDict[id].isVisible),
    grid,
    gridFormatter,
  };
}

export default convertDataToOptions;
