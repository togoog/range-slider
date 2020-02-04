import * as $ from 'jquery';

import { Options } from './types';
import { createRangeSlider, defaultOptions } from './range-slider';

/**
 * Range Slider as JQuery plugin
 */
$.fn.rangeSlider = function jqRangeSlider(options: Options): JQuery {
  const mergedOptions = $.extend(defaultOptions, options);

  return this.each(function jqRangeSliderFactory() {
    createRangeSlider(this, mergedOptions);
  });
};
