import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlStep({ options, onUpdate }: Config) {
  const { step } = options;
  const id = getRandomId('rs-step');
  const updateStep = (e: KeyboardEvent) =>
    onUpdate(e, options => {
      const newValue = (e.target as HTMLInputElement).value;
      return assoc('step', parseFloat(newValue), options);
    });
  const updateStepOnEnter = (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateStep(e) : null;

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
        @keydown=${updateStepOnEnter}
        @change=${updateStep}
      />
    </div>
  `;
}

export default controlStep;
