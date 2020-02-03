import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config, ElementAttributes } from '../../types';
import { getRandomId, valueFormatter } from '../../helpers';

const defaultAttributes = {
  type: 'number',
  valueFormatter,
  valueParser: parseFloat,
};

function controlMin(
  { options, onUpdate }: Config,
  { type, valueFormatter, valueParser }: ElementAttributes = defaultAttributes,
) {
  const { min } = options;
  const id = getRandomId('rs-min');
  const updateMin = (e: KeyboardEvent) => {
    e.preventDefault();
    onUpdate(options => {
      const newValue = (e.target as HTMLInputElement).value;
      return assoc('min', valueParser(newValue), options);
    });
  };
  const updateMinOnEnter = (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateMin(e) : null;

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Min
      </label>
      <input
        type=${type}
        id=${id}
        class="config-panel__input"
        value=${valueFormatter(min)}
        @keydown=${updateMinOnEnter}
        @change=${updateMin}
      />
    </div>
  `;
}

export default controlMin;
