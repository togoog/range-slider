import { EventEmitter } from 'events';
import { merge } from 'lodash';
import { CSSClasses } from './types';
import { GridOptions, IntervalOptions, HandleOptions, TooltipOptions } from './components';

export enum RangeSliderEvents {
  INIT = 'init',
  DESTROY = 'destroy',

  /**
   * Use this event when synchronizing the slider value to another element, such as an  <input>.
   * It fires every time the slider values are changed, either by a user or by calling API methods.
   * In most cases, this event should be more convenient than the 'slide' event.
   */
  UPDATE = 'update',

  /**
   * This event fires when a handle is clicked (mousedown, or the equivalent touch events).
   */
  SLIDE_START = 'slideStart',

  /**
   * This event is useful when you specifically want to listen to a handle being dragged,
   * but want to ignore other updates to the slider value. This event also fires on a change by a 'tap'.
   * In most cases, the 'update' is the better choice.
   */
  SLIDE = 'slide',

  /**
   * This event is the opposite of the 'start' event. If fires when a handle is released (mouseup etc),
   */
  SLIDE_END = 'slideEnd',
}

export interface RangeSliderOptions {
  // Options
  value: number | Array<number | HandleOptions>; // handle(s) positions
  min?: number; // minimum possible value
  max?: number; // maximum possible value
  step?: number | null; // handle step
  orientation?: 'horizontal' | 'vertical';
  padding?: number | [number, number]; // Padding limits how close to the slider edges handles can be.
  isDisabled?: boolean;
  isPolifill?: boolean;
  cssPrefix?: string;
  cssClasses?: CSSClasses; // common css classes

  // components
  tooltips?: boolean | Array<boolean | TooltipOptions>;
  intervals?: boolean | Array<boolean | IntervalOptions>;
  grid?: boolean | GridOptions;
}

export interface RangeSlider {
  get(): number | Array<number | [number, number]>;
  set(key: string, value: any): void;
  setHandle(index: number, value: number): void;
  toString(): string;
  reset(): void;
  destroy(): void;
}

const defaultOptions: RangeSliderOptions = {
  value: 50,
  min: 0,
  max: 100,
  step: null,
  orientation: 'horizontal',
  isDisabled: false,
  isPolifill: false,
  cssPrefix: 'range-slider-',
  cssClasses: {
    container: 'container',
    horizontal: 'horizontal',
    vertical: 'vertical',
    draggable: 'draggable',
    drag: 'state-drag',
    active: 'active',
    disabled: 'disabled',
  },
};

export class CurlyRangeSlider extends EventEmitter implements RangeSlider {
  constructor(private element: string | HTMLElement, private options: RangeSliderOptions = defaultOptions) {
    super();
  }

  /**
   * Merge provided options with those set on html element and return the result options bag.
   * @param element html element
   * @param options provided options
   */
  private getOptions(element: HTMLElement, options: RangeSliderOptions): RangeSliderOptions {
    const attributes: RangeSliderOptions = this.getAttributes(element);
    return merge(options, attributes);
  }

  /**
   * Get attributes from html element
   * @param element html element
   */
  private getAttributes(element: HTMLElement): RangeSliderOptions {
    const result: RangeSliderOptions = {
      value: 0,
    };

    return result;
  }

  /**
   * Check if options are valid
   * @param options range slider options
   */
  private validateOptions(options: RangeSliderOptions): boolean {
    return true;
  }

  // returns raw slider value: Array<Range | number>
  get(): number | Array<number | [number, number]> {
    return 0;
  }

  // Change slider value or option
  set(key: string, value: any): void {}

  // Set value for 1 handle at index (0 based)
  setHandle(index: number, value: number): void {}

  // convert value to string representation
  toString(): string {
    return 'range slider';
  }

  // Return to initial values
  reset(): void {}

  destroy(): void {}
}
