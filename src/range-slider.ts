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

// ────────────────────────────────────────────────────────────────────────────────

const defaultOptions: RangeSliderOptions = {
  value: [50],
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: [true],
};

class RangeSlider implements RangeSliderPlugin {
  constructor(
    private el: string,
    private options: RangeSliderOptions = defaultOptions,
  ) {}

  get<T extends OptionsKey>(key: T): RangeSliderOptions[T] {
    return this.options[key];
  }

  set<T extends OptionsKey>(key: T, value: RangeSliderOptions[T]): RangeSlider {
    this.options[key] = value;
    return this;
  }
}

export { RangeSlider };
