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
  controlTooltipFormatter,
  controlIntervals,
  controlGrid,
  controlGridFormatter,
} from '../components';
import '../../src/lit-range-slider';

class Example {
  protected rootEl: HTMLElement;

  constructor(id: string, protected options: Options) {
    this.rootEl = document.getElementById(id);
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
      controlTooltipFormatter,
      controlIntervals,
      controlGrid,
      controlGridFormatter,
    ];
  }

  render() {
    const { options } = this;
    const onFormUpdate = this.onFormUpdate.bind(this);
    const onRangeSliderUpdate = this.onRangeSliderUpdate.bind(this);

    const configPanel = configForm(
      { options, onUpdate: onFormUpdate },
      this.getConfigPanelElements(),
    );

    render(
      html`
        <div class="config-panel example__config-panel">${configPanel}</div>
        <div class="result-panel example__result-panel">
          <div class="example__result-panel-output">
            <label>
              Result:
              <input type="text" value=${getResultFromOptions(options)} />
            </label>
          </div>
          <div class="example__range-slider">
            <range-slider
              value=${JSON.stringify(options.value)}
              min=${options.min}
              max=${options.max}
              step=${options.step}
              orientation=${options.orientation}
              tooltips=${JSON.stringify(options.tooltips)}
              intervals=${JSON.stringify(options.intervals)}
              grid=${JSON.stringify(options.grid)}
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
