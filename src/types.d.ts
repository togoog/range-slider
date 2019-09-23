type FormatterOptions = {
  decimals: number;
  prefix: string;
  suffix: string;
};

type Formatter = Function | FormatterOptions;

type GridOptions = {
  isVisible: boolean;
  formatter: Formatter;
  generator: Function;
};

type HandleOptions = {
  value: number;
  isDraggable: boolean;
  isDisabled: boolean;
  respectConstrains: boolean;
  snapToGrid: boolean;
};

type IntervalOptions = {
  isVisible: boolean;
  isDraggable: boolean;
  isDisabled: boolean;
  minLength: number;
  maxLength: number;
};

type TooltipOptions = {
  isVisible: boolean;
  formatter: Formatter;
};

type RangeSliderOptions = {
  value: number | number[];
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  locale: string;
  direction: 'ltr' | 'rtl';
  padding: number | [number, number];
  isDisabled: boolean;
  isPolyfill: boolean;
  cssPrefix: string;
  cssClasses: {
    container: string;
    isHorizontal: string;
    isVertical: string;
    isDraggable: string;
    isDragged: string;
    isActive: string;
    isDisabled: string;
  };
  handles: (null | HandleOptions)[];
  tooltips: (boolean | TooltipOptions)[];
  intervals: (boolean | IntervalOptions)[];
  grid: GridOptions;
};

type RangeSliderAttributes = {
  [key in keyof Partial<RangeSliderOptions>]: string;
};

interface RangeSlider {
  get(): number | Array<number | [number, number]>;
  set(key: string, value: unknown): void;
  toString(): string;
  reset(): void;
  destroy(): void;
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
