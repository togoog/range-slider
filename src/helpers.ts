import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

/**
 * Create object from key value pairs
 * @param entries array of key value pairs
 */
function objectFromEntries<T>(entries: [string, T][]) {
  return Object.assign({}, ...Array.from(entries, ([k, v]) => ({ [k]: v })));
}

//
// ─── DOM MANIPULATION ───────────────────────────────────────────────────────────
//

/**
 * Query dom elements
 * @param selector css selector
 */
function $(selector: string): option.Option<Element[]> {
  return pipe(
    option.tryCatch(() => document.querySelectorAll(selector)),
    option.chain(v =>
      v.length === 0 ? option.none : option.some(Array.from(v)),
    ),
  );
}

/**
 * Get attributes from dom element
 * @param el dom element
 */
function getAttributes(el: Element): option.Option<RangeSliderAttributes> {
  const entries: [keyof RangeSliderOptions, string | null][] = [];

  // global options
  entries.push(['value', el.getAttribute('value')]);
  entries.push(['min', el.getAttribute('min')]);
  entries.push(['max', el.getAttribute('max')]);
  entries.push(['step', el.getAttribute('step')]);
  entries.push(['padding', el.getAttribute('data-padding')]);
  entries.push(['orientation', el.getAttribute('data-orientation')]);
  entries.push(['direction', el.getAttribute('data-direction')]);
  entries.push(['isDisabled', el.getAttribute('data-is-disabled')]);
  entries.push(['isPolyfill', el.getAttribute('data-is-polyfill')]);
  entries.push(['locale', el.getAttribute('data-locale')]);
  entries.push(['cssPrefix', el.getAttribute('data-css-prefix')]);
  entries.push(['cssClasses', el.getAttribute('data-css-classes')]);

  // components
  entries.push(['grid', el.getAttribute('data-grid')]);
  entries.push(['handles', el.getAttribute('data-handles')]);
  entries.push(['intervals', el.getAttribute('data-intervals')]);
  entries.push(['tooltips', el.getAttribute('data-tooltips')]);

  const notEmptyEntries: [keyof RangeSliderOptions, string][] = entries.filter(
    (entry): entry is [keyof RangeSliderOptions, string] =>
      entry[1] !== null && entry[1] !== undefined,
  );
  const result = objectFromEntries(notEmptyEntries);
  return option.some(result);
}

export { $, getAttributes, objectFromEntries };
