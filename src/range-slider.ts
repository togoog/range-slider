import { mergeAll, pick, forEach } from 'ramda';
import { EventEmitter } from 'events';
import {
  Plugin,
  RangeSliderError,
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
  Options,
  OptionsKey,
  Data,
} from './types';
import * as defaults from './defaults';
import { Model, View, Presenter } from './mvp';
import { selectElements } from './helpers';
import logError from './services/logger';
import {
  convertOptionsToData,
  convertDataToOptions,
} from './services/converters';
import { checkRangeSliderOptions } from './validators';

//
// ─── ERROR IDS ──────────────────────────────────────────────────────────────────
//

const ErrorCanNotFindDOMElements = 'RangeSlider/ErrorCanNotFindDOMElements';
const ErrorNotValidSourceType = 'RangeSlider/ErrorNotValidSourceType';

//
// ─── ERROR CONSTRUCTORS ─────────────────────────────────────────────────────────
//

function errCanNotFindDOMElements(selector: string): RangeSliderError {
  return {
    id: ErrorCanNotFindDOMElements,
    desc: `(can't find DOM elements with selector: ${selector})`,
  };
}

function errNotValidSourceType(source: string): RangeSliderError {
  return {
    id: ErrorNotValidSourceType,
    desc: `(source should be a CSS selector, HtmlElement or array of HtmlElements, instead ${source} given)`,
  };
}

// ────────────────────────────────────────────────────────────────────────────────

const defaultOptions: Options = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  cssClass: defaults.cssClass,
  tooltips: defaults.tooltipValue,
  tooltipFormatter: defaults.tooltipFormatter,
  intervals: defaults.intervalValue,
  grid: {
    isVisible: defaults.gridIsVisible,
    numCells: defaults.gridNumCells,
  },
  gridFormatter: defaults.gridFormatter,
};

class RangeSlider extends EventEmitter implements Plugin {
  static EVENT_UPDATE = 'update';

  static EVENT_ERRORS = 'errors';

  private model!: RangeSliderModel;

  private view!: RangeSliderView;

  private presenter!: RangeSliderPresenter;

  constructor(el: HTMLElement, options: Partial<Options> = defaultOptions) {
    super();

    const mergedOptions = mergeAll([defaultOptions, options]) as Options;
    const rs = this;

    checkRangeSliderOptions(mergedOptions)
      .mapLeft(forEach(logError))
      .map(options => {
        const data = convertOptionsToData(options);
        rs.model = new Model(data);
        rs.view = new View(el, options.cssClass);
        rs.presenter = new Presenter(rs.model, rs.view);
        rs.processModelEvents();
      });
  }

  get<K extends OptionsKey>(key: K): Options[K] {
    const options = convertDataToOptions(this.model.getAll());
    return options[key];
  }

  getAll() {
    return convertDataToOptions(this.model.getAll());
  }

  pick<K extends OptionsKey>(keys: K[]): Partial<Options> {
    const options = convertDataToOptions(this.model.getAll());
    return pick(keys, options);
  }

  set<K extends OptionsKey>(newOptions: Partial<Options>): RangeSlider {
    const options = convertDataToOptions(this.model.getAll());
    const mergedOptions = mergeAll([options, newOptions]) as Options;
    const newData = convertOptionsToData(mergedOptions);
    this.model.set(newData);
    return this;
  }

  private processModelEvents(): void {
    this.model.on(Model.EVENT_UPDATE, (data: Data) => {
      const options = convertDataToOptions(data);
      this.emit(RangeSlider.EVENT_UPDATE, options);
    });

    this.model.on(Model.EVENT_ERRORS, (errors: RangeSliderError[]) => {
      this.emit(RangeSlider.EVENT_ERRORS, errors);
    });
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
    return selectElements(source)
      .ifNothing(() => logError(errCanNotFindDOMElements(source)))
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

  logError(errNotValidSourceType(source));

  return [];
}

export { RangeSlider, createRangeSlider, defaultOptions };
