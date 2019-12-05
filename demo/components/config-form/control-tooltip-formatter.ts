import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { getRandomId, getFunctionBody } from '../../helpers';

function controlTooltipFormatter(
  { tooltipFormatter }: Options,
  onUpdate: Function,
) {
  const id = getRandomId('rs-tooltip-formatter');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Tooltip Formatter Function
      </label>
      <textarea
        id=${id}
        name="tooltipFormatter"
        class="config-panel__textarea"
        rows="3"
        @change=${onUpdate}
      >
${getFunctionBody(tooltipFormatter)}
      </textarea
      >
    </div>
  `;
}

export default controlTooltipFormatter;
