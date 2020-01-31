import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlTooltipFormatter({ options, onUpdate }: Config) {
  const { tooltipFormat } = options;
  const id = getRandomId('rs-tooltip-format');
  const syntaxDesc = html`
    <a
      class="config-panel__control-desc"
      href="https://github.com/alexei/sprintf.js"
      target="_blank"
    >
      syntax
    </a>
  `;

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Tooltip Format <br />
        (${syntaxDesc})
      </label>
      <input
        type="text"
        id=${id}
        class="config-panel__textarea"
        value=${tooltipFormat}
        @change=${(e: Event) =>
          onUpdate(options => {
            const newFormat = (e.target as HTMLTextAreaElement).value;
            return assoc('tooltipFormat', newFormat, options);
          })}
      />
    </div>
  `;
}

export default controlTooltipFormatter;
