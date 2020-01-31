import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config, ElementAttributes } from '../../types';
import { getRandomId, valueFormatter } from '../../helpers';

const defaultAttributes = {
  type: 'number',
  valueFormatter,
  valueParser: parseFloat,
};

function controlMax(
  { options, onUpdate }: Config,
  { type, valueFormatter, valueParser }: ElementAttributes = defaultAttributes,
) {
  const { max } = options;
  const id = getRandomId('rs-max');
  const updateMax = (e: KeyboardEvent) =>
    onUpdate(options => {
      const newValue = (e.target as HTMLInputElement).value;
      return assoc('max', valueParser(newValue), options);
    });
  const updateMaxOnEnter = (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateMax(e) : null;

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Max
      </label>
      <input
        type=${type}
        id=${id}
        class="config-panel__input"
        value=${valueFormatter(max)}
        @keydown=${updateMaxOnEnter}
        @change=${updateMax}
      />
    </div>
  `;
}

export default controlMax;
