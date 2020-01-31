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
  tooltipFormat,
  intervalIds,
  intervalDict,
  grid,
  gridFormat,
}: Data): Options {
  return {
    value: handleIds.map(id => handleDict[id].value),
    min,
    max,
    step,
    orientation,
    cssClass,
    tooltips: tooltipIds.map(id => tooltipDict[id].isVisible),
    tooltipFormat,
    intervals: intervalIds.map(id => intervalDict[id].isVisible),
    grid,
    gridFormat,
  };
}

export default convertDataToOptions;
