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
import { defaultOptions } from '../../src/range-slider';
import '../../src/lit-range-slider';

class Example {
  protected rootEl: HTMLElement;

  constructor(id: string, protected options: Options = defaultOptions) {
    this.rootEl = document.getElementById(id);
    this.onFormUpdate = this.onFormUpdate.bind(this);
    this.onRangeSliderUpdate = this.onRangeSliderUpdate.bind(this);
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
    const { options, onFormUpdate, onRangeSliderUpdate } = this;
    const configPanel = configForm(
      { options, onUpdate: onFormUpdate },
      this.getConfigPanelElements(),
    );

    render(
      html`
        <div class="config-panel example__config-panel">${configPanel}</div>
        <div class="result-panel example__result-panel">
          <div class="result-panel__output">
            <input type="text" value=${getResultFromOptions(options)} />
          </div>
          <div class="result-panel__range-slider">
            <range-slider
              value=${JSON.stringify(options.value)}
              min=${options.min}
              max=${options.max}
              step=${options.step}
              orientation=${options.orientation}
              tooltips=${JSON.stringify(options.tooltips)}
              tooltipFormat=${options.tooltipFormat}
              intervals=${JSON.stringify(options.intervals)}
              grid=${JSON.stringify(options.grid)}
              gridFormat=${options.gridFormat}
              @update=${e => onRangeSliderUpdate(e.detail.options)}
            ></range-slider>
          </div>
        </div>
      `,
      this.rootEl,
    );
  }

  onFormUpdate(proposal: (options: Options) => Options) {
    this.options = proposal(this.options);
    this.render();
  }

  onRangeSliderUpdate(options: Options) {
    this.options = options;
    this.render();
  }
}

export default Example;
