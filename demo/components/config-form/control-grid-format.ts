import { html } from 'lit-html';
import { assoc } from 'ramda';

import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlGridFormat({ options, onUpdate }: Config) {
  const { gridFormat } = options;
  const id = getRandomId('rs-grid-format');
  const syntaxDesc = html`
    <a
      class="config-panel__control-desc"
      href="https://github.com/romengrus/range-slider"
      target="_blank"
    >
      syntax
    </a>
  `;
  const updateFormat = (e: KeyboardEvent) => {
    e.preventDefault();
    onUpdate(options => {
      const newFormat = (e.target as HTMLTextAreaElement).value;
      return assoc('gridFormat', newFormat, options);
    });
  };
  const updateFormatOnEnter = (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateFormat(e) : null;

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Grid Format <br />
        (${syntaxDesc})
      </label>
      <input
        type="text"
        id=${id}
        class="config-panel__textarea"
        value=${gridFormat}
        @keydown=${updateFormatOnEnter}
        @change=${updateFormat}
      />
    </div>
  `;
}

export default controlGridFormat;
