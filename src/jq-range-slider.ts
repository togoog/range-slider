import * as $ from 'jquery';
import { createRangeSlider, defaultOptions } from './range-slider';
import { Options } from './types';

/**
 * Range Slider as JQuery plugin
 */
$.fn.rangeSlider = function jqRangeSlider(options: Options): JQuery {
  const mergedOptions = $.extend(defaultOptions, options);

  return this.each(function jqRangeSliderFactory() {
    createRangeSlider(this, mergedOptions);
  });
};
