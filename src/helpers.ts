/**
 * Generate arithmetic progression generator.
 *
 * @param start range start (included)
 * @param stop range stop (included)
 * @param step delta between numbers
 */
export function* range(start: number, stop?: number, step: number = 1): IterableIterator<number> {
  // when only 1 parameter passed
  if (typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }

  // return if sequence can not be generated with provided parameters
  if (step === 0 || (step > 0 && start > stop) || (step < 0 && start < stop)) return;

  let current = start;

  while (step > 0 ? current <= stop : current >= stop) {
    yield current;
    current += step;
  }

  // add stop as a final number in sequence
  if (current - step !== stop) {
    yield stop;
  }
}
