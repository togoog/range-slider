import { Maybe, Nothing, Just } from 'purify-ts/Maybe';
import { pipe, ifElse, always } from 'ramda';
import { lengthEq } from 'ramda-adjunct';

/**
 * Query dom elements
 * @param selector css selector
 */
function $(selector: string): Maybe<Element[]> {
  // prettier-ignore
  return Maybe
    .encase(() => document.querySelectorAll(selector))
    .chain<Element[]>(
      ifElse(
        lengthEq(0),
        always(Nothing),
        pipe(
          Array.from,
          Just,
        ),
      ),
  );
}

export { $ };
