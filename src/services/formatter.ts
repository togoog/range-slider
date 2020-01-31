import { sprintf } from 'sprintf-js';

/**
 *
 * @param format Format to apply (syntax: https://github.com/alexei/sprintf.js)
 * @param value Number to format
 */
function formatValue(format: string, value: number): string {
  return sprintf(format, value);
}

export default formatValue;
