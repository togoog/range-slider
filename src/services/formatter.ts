import * as moment from 'moment';
import { sprintf } from 'sprintf-js';

/**
 *
 * @param number number to format
 * @param format format to apply (syntax: https://github.com/alexei/sprintf.js)
 */
function formatNumber(number: number, format = '%d'): string {
  return sprintf(format, number);
}

/**
 *
 * @param timestamp unix timestamp
 * @param format date format to apply (https://momentjs.com/docs/#/displaying/)
 */
function formatDate(timestamp: number, format = 'DD-MM-YYYY'): string {
  return moment.unix(timestamp).format(format);
}

const replacementDict = {
  number: formatNumber,
  date: formatDate,
};

function formatValue(template: string, value: number): string {
  const pattern = /{{\s*(number|date)\s*(?:\(([^)]+)\))?\s*}}/g;
  return template.replace(pattern, function substituteValue(
    fullMatch: string,
    replacementType: 'number' | 'date',
    format: string,
  ) {
    return replacementDict[replacementType](value, format);
  });
}

export default formatValue;
