import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlMax({ options, onUpdate }: Config) {
  const { max } = options;
  const id = getRandomId('rs-max');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Max
      </label>
      <input
        type="number"
        id=${id}
        class="config-panel__input"
        value=${max}
        @input=${(e: KeyboardEvent) =>
          onUpdate(e, options => {
            const newValue = (e.target as HTMLInputElement).value;
            return assoc('max', parseFloat(newValue), options);
          })}
      />
    </div>
  `;
}

export default controlMax;
