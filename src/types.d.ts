type RangeSliderOptions = {
  value: number | [number, number];
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  tooltips: boolean | [boolean, boolean];
};

type OptionsKey = keyof RangeSliderOptions;

interface RangeSliderPlugin {
  get<T extends OptionsKey>(key: T): RangeSliderOptions[T];
  set<T extends OptionsKey>(
    key: T,
    value: RangeSliderOptions[T],
  ): RangeSliderPlugin;
}

type Events = {
  init: void;
  destroy: void;

  /**
   * Use this event when synchronizing the slider value to another element, such as an  <input>.
   * It fires every time the slider values are changed, either by a user or by calling API methods.
   * In most cases, this event should be more convenient than the 'slide' event.
   */
  update: void;

  /**
   * This event fires when a handle is clicked (mousedown, or the equivalent touch events).
   */
  slide_start: void;

  /**
   * This event is useful when you specifically want to listen to a handle being dragged,
   * but want to ignore other updates to the slider value. This event also fires on a change by a 'tap'.
   * In most cases, the 'update' is the better choice.
   */
  slide: void;

  /**
   * This event is the opposite of the 'start' event. If fires when a handle is released (mouseup etc),
   */
  slide_end: void;
};
