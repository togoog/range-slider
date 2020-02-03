import { html, render } from 'lit-html';
import { Options } from '../../src/types';
import { getResultFromOptions } from '../helpers';
import {
  configForm,
  controlValue,
  controlMin,
  controlMax,
  controlStep,
  controlOrientation,
  controlTooltips,
  controlTooltipFormat,
  controlIntervals,
  controlGrid,
  controlGridFormat,
} from '../components';
import { defaultOptions, RangeSlider } from '../../src/range-slider';

class Example {
  protected rootEl: HTMLElement;

  protected configEl: HTMLElement;

  protected resultEl: HTMLElement;

  protected rangeSliderEl: HTMLElement;

  protected rs: RangeSlider;

  constructor(id: string, protected options: Options = defaultOptions) {
    // get container elements
    this.rootEl = document.getElementById(id);
    this.configEl = this.rootEl.querySelector('.config-panel');
    this.resultEl = this.rootEl.querySelector('.result-panel__output');
    this.rangeSliderEl = this.rootEl.querySelector(
      '.result-panel__range-slider > input[type="range"]',
    );

    // bind event handlers
    this.onFormUpdate = this.onFormUpdate.bind(this);
    this.onRangeSliderUpdate = this.onRangeSliderUpdate.bind(this);

    // init RangeSlider
    this.rs = new RangeSlider(this.rangeSliderEl, options);
    this.rs.on(RangeSlider.EVENT_UPDATE, this.onRangeSliderUpdate);

    this.render();
  }

  // eslint-disable-next-line class-methods-use-this
  getConfigPanelElements() {
    return [
      controlValue,
      controlMin,
      controlMax,
      controlStep,
      controlOrientation,
      controlTooltips,
      controlTooltipFormat,
      controlIntervals,
      controlGrid,
      controlGridFormat,
    ];
  }

  render() {
    const { options } = this;

    this.renderResult(options);
    this.renderConfigPanel(options);
  }

  onFormUpdate(proposal: (options: Options) => Options) {
    this.options = proposal(this.options);
    this.render();
    this.rs.set(this.options);
  }

  onRangeSliderUpdate(options: Options) {
    this.options = options;
    this.render();
  }

  private renderConfigPanel(options: Options) {
    const { configEl, onFormUpdate } = this;
    const configPanel = configForm(
      { options, onUpdate: onFormUpdate },
      this.getConfigPanelElements(),
    );

    render(
      html`
        ${configPanel}
      `,
      configEl,
    );
  }

  private renderResult(options: Options) {
    render(
      html`
        ${getResultFromOptions(options)}
      `,
      this.resultEl,
    );
  }
}

export default Example;
