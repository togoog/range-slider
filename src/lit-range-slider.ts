import { LitElement, html } from 'lit-element';
import { Options } from './types';
import { RangeSlider, defaultOptions } from './range-slider';
import './styles/style.scss';

/**
 * Range Slider as Lit Element
 */
class LitRangeSlider extends LitElement {
  value: Options['value'];

  min: Options['min'];

  max: Options['max'];

  step: Options['step'];

  orientation: Options['orientation'];

  cssClass: Options['cssClass'];

  tooltips: Options['tooltips'];

  tooltipFormat: Options['tooltipFormat'];

  intervals: Options['intervals'];

  grid: Options['grid'];

  gridFormat: Options['gridFormat'];

  // RangeSlider instance
  rs: RangeSlider | null;

  static get properties() {
    return {
      value: { type: Array },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      orientation: { type: String },
      cssClass: { type: String },
      tooltips: { type: Array },
      tooltipFormat: { type: String },
      intervals: { type: Array },
      grid: { type: Object },
      gridFormat: { type: String },
    };
  }

  constructor() {
    super();
    // set default Range Slider props
    this.value = defaultOptions.value;
    this.min = defaultOptions.min;
    this.max = defaultOptions.max;
    this.step = defaultOptions.step;
    this.orientation = defaultOptions.orientation;
    this.cssClass = defaultOptions.cssClass;
    this.tooltips = defaultOptions.tooltips;
    this.tooltipFormat = defaultOptions.tooltipFormat;
    this.intervals = defaultOptions.intervals;
    this.grid = defaultOptions.grid;
    this.gridFormat = defaultOptions.gridFormat;

    // set default Range Slider instance
    this.rs = null;
  }

  getOptions(): Options {
    return {
      value: this.value,
      min: this.min,
      max: this.max,
      step: this.step,
      orientation: this.orientation,
      cssClass: this.cssClass,
      tooltips: this.tooltips,
      tooltipFormat: this.tooltipFormat,
      intervals: this.intervals,
      grid: this.grid,
      gridFormat: this.gridFormat,
    };
  }

  firstUpdated() {
    const onUpdate = this.onUpdate.bind(this);
    const inputToReplace = this.shadowRoot?.getElementById(
      'range',
    ) as HTMLInputElement;
    this.rs = new RangeSlider(inputToReplace, this.getOptions());
    this.rs.on(RangeSlider.EVENT_UPDATE, onUpdate);
  }

  updated() {
    // eslint-disable-next-line no-unused-expressions
    this.rs?.set(this.getOptions());
  }

  render() {
    return html`
      <input
        type="range"
        id="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
      />
    `;
  }

  private onUpdate(options: Options) {
    const updateEvent = new CustomEvent(RangeSlider.EVENT_UPDATE, {
      detail: { options },
    });
    this.dispatchEvent(updateEvent);
  }
}

customElements.define('range-slider', LitRangeSlider);
