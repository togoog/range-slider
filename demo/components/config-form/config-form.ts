import { html } from 'lit-html';
import { Options, GridOptions } from '../../../src/types';
import controlValue from './control-value';
import controlMin from './control-min';
import controlMax from './control-max';
import controlStep from './control-step';
import controlOrientation from './control-orientation';
import controlTooltips from './control-tooltips';
import controlTooltipFormatter from './control-tooltip-formatter';
import controlIntervals from './control-intervals';
import controlGrid from './control-grid';

function configForm(options: Options, onUpdate: Function) {
  return html`
    <h2 class="config-panel__header">Config Panel</h2>
    <form
      action="#"
      class="config-panel__form"
      @submit=${(e: MouseEvent) => e.preventDefault()}
    >
      ${controlValue(options, onUpdate)} ${controlMin(options, onUpdate)}
      ${controlMax(options, onUpdate)} ${controlStep(options, onUpdate)}
      ${controlOrientation(options, onUpdate)}
      ${controlTooltips(options, onUpdate)}
      ${controlTooltipFormatter(options, onUpdate)}
      ${controlIntervals(options, onUpdate)} ${controlGrid(options, onUpdate)}
    </form>
  `;
}

export default configForm;
