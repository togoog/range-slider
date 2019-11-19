import { applySpec } from 'ramda';
import { Data, Options, OptionsKey } from '../types';

function convertDataToOptions(data: Data): Options {
  const transformations: { [key in OptionsKey]: Function } = {
    value: (d: Data) => d.handleIds.map(id => d.handles[id]),
    min: (d: Data) => d.min,
    max: (d: Data) => d.max,
    step: (d: Data) => d.step,
    orientation: (d: Data) => d.orientation,
    cssClass: (d: Data) => d.cssClass,
    tooltips: (d: Data) => d.tooltipIds.map(id => d.tooltips[id]),
    tooltipFormatter: (d: Data) => d.tooltipFormatter,
    intervals: (d: Data) => d.intervalIds.map(id => d.intervals[id]),
    grid: (d: Data) => d.grid,
  };

  return applySpec(transformations)(data) as Options;
}

export default convertDataToOptions;
