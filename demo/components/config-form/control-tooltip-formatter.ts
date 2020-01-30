import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId, getFunctionAsText } from '../../helpers';

function controlTooltipFormatter({ options, onUpdate }: Config) {
  const { tooltipFormatter } = options;
  const id = getRandomId('rs-tooltip-formatter');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Tooltip Formatter Function
      </label>
      <textarea
        id=${id}
        class="config-panel__textarea"
        rows="6"
        @change=${(e: Event) =>
          onUpdate(e, options => {
            const newFnBody = (e.target as HTMLTextAreaElement).value;
            // eslint-disable-next-line no-new-func
            const newFn = new Function('value', newFnBody);
            return assoc('tooltipFormatter', newFn, options);
          })}
      >
${getFunctionAsText(tooltipFormatter)}
      </textarea
      >
    </div>
  `;
}

export default controlTooltipFormatter;
