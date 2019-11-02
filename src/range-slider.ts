import { map, mergeAll, clone, applySpec, clamp, fromPairs } from 'ramda';
import {
  Plugin,
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
  Options,
  OptionsKey,
  Data,
  DataKey,
  Tooltip,
  TooltipId,
  IntervalId,
  Interval,
  HandleId,
  Handle,
} from './types';
import { Model, View, Presenter } from './mvp';
import {
  $,
  toArray,
  makeId,
  closestToStep,
  getRelativePosition,
} from './helpers';
import { checkRangeSliderOptions } from './validators';

//
// ─── EVENTS ─────────────────────────────────────────────────────────────────────
//

const EVENT_INIT = 'init';
const EVENT_DESTROY = 'destroy';

/**
 * Use this event when synchronizing the slider value to another element, such as an  <input>.
 * It fires every time the slider values are changed, either by a user or by calling API methods.
 * In most cases, this event should be more convenient than the 'slide' event.
 */
const EVENT_UPDATE = 'update';

/**
 * This event fires when a handle is clicked (mousedown, or the equivalent touch events).
 */
const EVENT_SLIDE_START = 'slideStart';

/**
 * This event is useful when you specifically want to listen to a handle being dragged,
 * but want to ignore other updates to the slider value. This event also fires on a change by a 'tap'.
 * In most cases, the 'update' is the better choice.
 */
const EVENT_SLIDE = 'slide';

/**
 * This event is the opposite of the 'start' event. If fires when a handle is released (mouseup etc),
 */
const EVENT_SLIDE_END = 'slideEnd';

//
// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────────
//

function makeHandles(op: Options): Data['handles'] {
  const role = 'handle';
  const cssClass = `${op.cssClass}__${role}`;

  const handles = toArray(op.value).map((val, idx): [HandleId, Handle] => {});
}

function makeTooltips(op: Options): Data['tooltips'] {
  const role = 'tooltip';
  const cssClass = `${op.cssClass}__${role}`;

  const tooltips = toArray(op.tooltips).map((isVisible, idx): [
    TooltipId,
    Tooltip,
  ] => {
    const id = makeId(role, idx);
    const realValue = toArray(op.value)[idx];

    return [
      id,
      {
        id,
        cssClass,
        isVisible,
        hasCollisions: false,
        orientation: op.orientation,
        content: op.tooltipFormatter(realValue),
        position: getRelativePosition(op.min, op.max, realValue),
        role,
      },
    ];
  });

  return fromPairs(tooltips);
}

function makeIntervals(op: Options): Data['intervals'] {
  const role = 'interval';
  const cssClass = `${op.cssClass}__${role}`;
  const allValues = [op.min, ...toArray(op.value), op.max];

  const intervals = toArray(op.intervals).map((isVisible, idx): [
    IntervalId,
    Interval,
  ] => {
    const id = makeId(role, idx);
    const realValueFrom = allValues[idx];
    const realValueTo = allValues[idx + 1];

    return [
      id,
      {
        id,
        cssClass,
        isVisible,
        orientation: op.orientation,
        from: getRelativePosition(op.min, op.max, realValueFrom),
        to: getRelativePosition(op.min, op.max, realValueTo),
        role,
      },
    ];
  });

  return fromPairs(intervals);
}

function convertOptionsToData(options: Options): Data {
  const clonedOptions = clone(options);

  const transformations: {
    [key in DataKey]: (op: Options) => Data[DataKey];
  } = {
    values: op =>
      fromPairs(
        toArray(op.value).map((val, idx) => [
          makeId('value', idx),
          clamp(op.min, op.max, closestToStep(op.step, val as number)),
        ]),
      ),
    valueIds: op => toArray(op.value).map((_, idx) => makeId('value', idx)),
    min: op => op.min,
    max: op => op.max,
    step: op => op.step,
    orientation: op => op.orientation,
    cssClass: op => op.cssClass,
    handles: op => makeHandles(op),
    handleIds: op => toArray(op.value).map((_, idx) => makeId('handle', idx)),
    tooltips: op => makeTooltips(op),
    tooltipIds: op =>
      toArray(op.tooltips).map((_, idx) => makeId('tooltip', idx)),
    tooltipFormatter: op => op.tooltipFormatter,
    // collisions between tooltips can only be known after render
    tooltipCollisions: () => [],
    intervals: op => makeIntervals(op),
    intervalIds: op =>
      toArray(op.intervals).map((_, idx) => makeId('interval', idx)),
  };

  return applySpec(transformations)(clonedOptions) as Data;
}

function convertDataToOptions(data: Data): Options {
  const clonedData = clone(data);

  const transformations: { [key in OptionsKey]: Function } = {
    value: (d: Data) => d.valueIds.map(id => d.values[id]),
    min: (d: Data) => d.min,
    max: (d: Data) => d.max,
    step: (d: Data) => d.step,
    orientation: (d: Data) => d.orientation,
    tooltips: (d: Data) => d.tooltipIds.map(id => d.tooltips[id].isVisible),
    tooltipFormatter: (d: Data) => d.tooltipFormatter,
    intervals: (d: Data) => d.intervalIds.map(id => d.intervals[id].isVisible),
    cssClass: (d: Data) => d.cssClass,
  };

  return applySpec(transformations)(clonedData) as Options;
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultOptions: Options = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  cssClass: 'range-slider',
  tooltips: true,
  tooltipFormatter: (value: number) => value.toLocaleString(),
  intervals: [true, false],
};

class RangeSlider implements Plugin {
  private model!: RangeSliderModel;
  private view!: RangeSliderView;
  private presenter!: RangeSliderPresenter;

  constructor(el: HTMLElement, options: Partial<Options> = defaultOptions) {
    // fill in missing options
    const mergedOptions = mergeAll([defaultOptions, options]) as Options;

    // if options are not valid -> show message to user in console and exit
    const optionErrors = checkRangeSliderOptions(mergedOptions);
    if (optionErrors.isLeft()) {
      console.error(optionErrors.unsafeCoerce());
      return;
    }

    const data = convertOptionsToData(mergedOptions);
    this.model = new Model(data);
    this.view = new View(el);
    this.presenter = new Presenter(this.model, this.view);
  }

  get<T extends OptionsKey>(key: T): Options[T] {
    const options = convertDataToOptions(this.model.getAll());
    return options[key];
  }

  set<T extends OptionsKey>(key: T, value: Options[T]): RangeSlider {
    const options = convertDataToOptions(this.model.getAll());
    options[key] = value;
    const data = convertOptionsToData(options);
    this.model.setAll(data);
    return this;
  }

  getAll(): Options {
    const options = convertDataToOptions(this.model.getAll());
    return options;
  }

  setAll(options: Options): void {
    const data = convertOptionsToData(options);
    this.model.setAll(data);
  }
}

function createRangeSlider(
  source: string | HTMLElement | HTMLElement[],
  options?: Partial<Options>,
): RangeSlider[] {
  // if source is css selector
  if (typeof source === 'string') {
    return $(source).caseOf({
      Just: map(el => new RangeSlider(el, options)),
      Nothing: () => [],
    });
  }

  if (Array.isArray(source)) {
    return source.map(el => new RangeSlider(el, options));
  }

  if (source instanceof HTMLElement) {
    return [new RangeSlider(source, options)];
  }

  return [];
}

export { RangeSlider, createRangeSlider };
