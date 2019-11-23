/* eslint-disable no-console */
import { RangeSliderError } from '../types';

function logError(err: RangeSliderError): void {
  console.error(`[${err.id}] -> ${err.desc}`);
}

export default logError;
