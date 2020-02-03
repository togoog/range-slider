import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config, ElementAttributes } from '../../types';
import { getRandomId, valueFormatter } from '../../helpers';

const defaultAttributes = {
  type: 'number',
  valueFormatter,
  valueParser: parseFloat,
};

function controlStep(
  { options, onUpdate }: Config,
  { type, valueFormatter, valueParser }: ElementAttributes = defaultAttributes,
) {
  const { step } = options;
  const id = getRandomId('rs-step');
  const updateStep = (e: KeyboardEvent) => {
    e.preventDefault();
    onUpdate(options => {
      const newValue = (e.target as HTMLInputElement).value;
      return assoc('step', valueParser(newValue), options);
    });
  };
  const updateStepOnEnter = (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateStep(e) : null;

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Step
      </label>
      <input
        type=${type}
        id=${id}
        class="config-panel__input"
        value=${valueFormatter(step)}
        min="0"
        @keydown=${updateStepOnEnter}
        @change=${updateStep}
      />
    </div>
  `;
}

export default controlStep;
