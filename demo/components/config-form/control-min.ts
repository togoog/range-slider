import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlMin({ options, onUpdate }: Config) {
  const { min } = options;
  const id = getRandomId('rs-min');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Min
      </label>
      <input
        type="number"
        id=${id}
        class="config-panel__input"
        value=${min}
        @input=${(e: KeyboardEvent) =>
          onUpdate(e, options => {
            const newValue = (e.target as HTMLInputElement).value;
            return assoc('min', parseFloat(newValue), options);
          })}
      />
    </div>
  `;
}

export default controlMin;
