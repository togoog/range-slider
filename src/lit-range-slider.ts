import { LitElement, html } from 'lit-element';
import { Options } from './types';
import { RangeSlider, defaultOptions } from './range-slider';
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

  // RangeSlider instance
  rs: RangeSlider | null;

  static get properties() {
    return {
      value: {
        type: Array,
        hasChanged(newVal: number[], oldVal: number[]) {
          if (newVal.length === undefined) return false;
          return (
            newVal.length === oldVal.length &&
            newVal.every((v: number, i: number) => v === oldVal[i])
          );
        },
      },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      orientation: { type: String },
      cssClass: { type: String },
      tooltips: { type: Array },
      tooltipFormatter: { type: String },
      intervals: { type: Array },
      grid: { type: Object },
      gridFormatter: { type: String },
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
    this.tooltipFormatter = defaultOptions.tooltipFormatter;
    this.intervals = defaultOptions.intervals;
    this.grid = defaultOptions.grid;
    this.gridFormatter = defaultOptions.gridFormatter;

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
      tooltipFormatter: this.tooltipFormatter,
      intervals: this.intervals,
      grid: this.grid,
      gridFormatter: this.gridFormatter,
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
