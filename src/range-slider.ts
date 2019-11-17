import { mergeAll } from 'ramda';
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
import { logError } from './services/logger';
import { convertOptionsToData, convertDataToOptions } from './converters';
import { checkRangeSliderOptions } from './validators';

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
    const mergedOptions = mergeAll([defaultOptions, options]) as Options;
    const rs = this;

    checkRangeSliderOptions(mergedOptions)
      .mapLeft(err => logError('RangeSlider', err))
      .map(options => {
        const data = convertOptionsToData(options);
        rs.model = new Model(data);
        rs.view = new View(el);
        rs.presenter = new Presenter(this.model, this.view);
      });
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

// ────────────────────────────────────────────────────────────────────────────────

/**
 * RangeSlider factory function
 * @param source css selector, HTMLElement or array of HTMLElements
 * @param options object with RangeSlider options
 */
function createRangeSlider(
  source: string | HTMLElement | HTMLElement[],
  options?: Partial<Options>,
): RangeSlider[] {
  if (typeof source === 'string') {
    return $(source)
      .ifNothing(() =>
        logError('RangeSlider', `can't find elements by selector: ${source}`),
      )
      .map(elements => elements.map(el => new RangeSlider(el, options)))
      .toList()
      .flat();
  }

  if (Array.isArray(source)) {
    return source.map(el => new RangeSlider(el, options));
  }

  if (source instanceof HTMLElement) {
    return [new RangeSlider(source, options)];
  }

  logError(
    'RangeSlider',
    'provided source is not a valid css selector, HTMLElement or array of HTMLElements',
  );

  return [];
}

export { RangeSlider, createRangeSlider };
