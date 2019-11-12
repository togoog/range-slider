import { map, mergeAll } from 'ramda';
import {
  Plugin,
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
  Options,
  OptionsKey,
} from './types';
import { Model, View, Presenter } from './mvp';
import { $ } from './helpers';
import { convertOptionsToData, convertDataToOptions } from './converters';
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
  grid: false,
};

class RangeSlider implements Plugin {
  private model!: RangeSliderModel;
  private view!: RangeSliderView;
  private presenter!: RangeSliderPresenter;

  constructor(el: HTMLElement, options: Partial<Options> = defaultOptions) {
    // add missing props
    const mergedOptions = mergeAll([defaultOptions, options]) as Options;

    // if options are not valid -> show message to user in console and exit
    const validationResults = checkRangeSliderOptions(mergedOptions);
    if (validationResults.isLeft()) {
      console.error(validationResults.unsafeCoerce());
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
