import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { getRandomId } from '../../helpers';

function controlStep({ step }: Options, onUpdate: Function) {
  const id = getRandomId('rs-step');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Step
      </label>
      <input
        type="number"
        id=${id}
        name="step"
        class="config-panel__input"
        value=${step}
        min="0"
        @input=${onUpdate}
      />
    </div>
  `;
}

export default controlStep;
