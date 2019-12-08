import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlStep({ options, onUpdate }: Config) {
  const { step } = options;
  const id = getRandomId('rs-step');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Step
      </label>
      <input
        type="number"
        id=${id}
        class="config-panel__input"
        value=${step}
        min="0"
        @input=${(e: KeyboardEvent) =>
          onUpdate(e, options => {
            const newValue = (e.target as HTMLInputElement).value;
            return assoc('step', parseFloat(newValue), options);
          })}
      />
    </div>
  `;
}

export default controlStep;
