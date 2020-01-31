import { LitElement, html } from 'lit-element';
import { Options } from './types';
import { toArray } from './helpers';
import { createRangeSlider, defaultOptions } from './range-slider';
import './styles/style.scss';

class LitRangeSlider extends LitElement {
  value: Options['value'];

  min: Options['min'];

  max: Options['max'];

  step: Options['step'];

  orientation: Options['orientation'];

  cssClass: Options['cssClass'];

  tooltips: Options['tooltips'];

  tooltipFormatter: Options['tooltipFormatter'];

  intervals: Options['intervals'];

  grid: Options['grid'];

  gridFormatter: Options['gridFormatter'];

  static get properties() {
    return {
      value: {
        converter: {
          fromAttribute: (value: string) => toArray(value).map(parseFloat),
          toAttribute: String,
        },
      },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      orientation: { type: String },
      cssClass: { type: String },
      tooltips: {
        converter: {
          fromAttribute: (value: string) => toArray(value).map(Boolean),
          toAttribute: String,
        },
      },
      tooltipFormatter: {
        converter: {
          // eval is evil, but ...
          // For now this is a best option I could found
          // eslint-disable-next-line no-new-func
          fromAttribute: (value: string) => new Function('value', value),
          toAttribute: String,
        },
      },
      intervals: {
        converter: {
          fromAttribute: (value: string) => toArray(value).map(Boolean),
          toAttribute: String,
        },
      },
      grid: {
        converter: {
          fromAttribute: (value: string) => {
            if (['true', 'false'].includes(value.toLowerCase())) {
              return Boolean(value);
            }

            return JSON.parse(value);
          },
          toAttribute: String,
        },
      },
      gridFormatter: {
        converter: {
          // same as for tooltipFormatter ...
          // eslint-disable-next-line no-new-func
          fromAttribute: (value: string) => new Function('value', value),
          toAttribute: String,
        },
      },
    };
  }

  constructor() {
    super();
    this.value = defaultOptions.value;
    this.min = defaultOptions.min;
    this.max = defaultOptions.max;
    this.step = defaultOptions.step;
    this.orientation = defaultOptions.orientation;
    this.cssClass = defaultOptions.cssClass;
    this.tooltips = defaultOptions.tooltips;
    this.tooltipFormatter = defaultOptions.tooltipFormatter;
    this.intervals = defaultOptions.intervals;
    this.grid = defaultOptions.grid;
    this.gridFormatter = defaultOptions.gridFormatter;
  }

  firstUpdated() {
    const options: Options = {
      value: this.value,
      min: this.min,
      max: this.max,
      step: this.step,
      orientation: this.orientation,
      cssClass: this.cssClass,
      tooltips: this.tooltips,
      tooltipFormatter: this.tooltipFormatter,
      intervals: this.intervals,
      grid: this.grid,
      gridFormatter: this.gridFormatter,
    };

    const inputToReplace = this.shadowRoot?.getElementById(
      'range',
    ) as HTMLInputElement;
    createRangeSlider(inputToReplace, options);
  }

  render() {
    return html`
      <input
        type="range"
        id="range"
        min="${this.min}"
        max="${this.max}"
        value="${this.value}"
      />
    `;
  }
}

customElements.define('range-slider', LitRangeSlider);
