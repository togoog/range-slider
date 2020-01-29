import { html, render } from 'lit-html';
import { Options } from '../../../src/types';
import { Config, ConfigFormElement, OnConfigFormUpdate } from '../../types';
import controlValue from './control-value';
import controlMin from './control-min';
import controlMax from './control-max';
import controlStep from './control-step';
import controlOrientation from './control-orientation';
import controlTooltips from './control-tooltips';
import controlTooltipFormatter from './control-tooltip-formatter';
import controlIntervals from './control-intervals';
import controlGrid from './control-grid';
import controlGridFormatter from './control-grid-formatter';

const defaultElements = [
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

function configForm(config: Config, elements?: ConfigFormElement[]) {
  return html`
    <h2 class="config-panel__header">Config Panel</h2>
    <form
      action="#"
      class="config-panel__form"
      @submit=${(e: MouseEvent) => e.preventDefault()}
    >
      <input
        type="hidden"
        name="options"
        class="js-options"
        value="${JSON.stringify(config.options)}"
      />

      ${elements && elements.map(element => element(config))}
    </form>
  `;
}

function renderConfigForm(
  options: Options,
  onUpdate: OnConfigFormUpdate,
  container: Element,
  elements: ConfigFormElement[] = defaultElements,
) {
  render(configForm({ options, onUpdate }, elements), container);
}

export default configForm;
export { renderConfigForm };
