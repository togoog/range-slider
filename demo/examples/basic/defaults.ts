import { Options } from '../../../src/types';

const options: Partial<Options> = {
  value: 500,
  min: -1000,
  max: 1000,
  step: 10,
  tooltips: true,
  intervals: false,
  grid: { isVisible: true, numCells: [4, 2, 5] },
};

export default options;
