import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { $ } from './helpers';

const defaultOptions: RangeSliderOptions = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  locale: 'en-US',
  direction: 'ltr',
  isDisabled: false,
  isPolyfill: false,
  padding: 0,
  cssPrefix: 'range-slider-',
  cssClasses: {
    container: 'container',
    isHorizontal: 'horizontal',
    isVertical: 'vertical',
    isDraggable: 'draggable',
    isDragged: 'state-drag',
    isActive: 'active',
    isDisabled: 'disabled',
  },
  handles: [null],
  tooltips: [true],
  intervals: [true, false],
  grid: {
    isVisible: false,
    formatter: () => '',
    generator: () => '',
  },
};

class RangeSlider implements RangeSlider {
  constructor(
    el: string | Element | Element[] | NodeList,
    options: Partial<RangeSliderOptions> = defaultOptions,
  ) {
    // get dom elements that should be transformed to range sliders
    const elements =
      typeof el === 'string'
        ? $(el)
        : el instanceof Element
        ? option.some([el])
        : el instanceof NodeList
        ? option.some(Array.from(el) as Element[])
        : el.every(v => v instanceof Element)
        ? option.some(el)
        : option.none;

    pipe(
      elements,
      option.map(this.init),
    );
  }

  /**
   * Init RangeSlider for each provided element
   * @param elements dome elements
   */
  private init(elements: Element[]) {}
}

export default RangeSlider;
