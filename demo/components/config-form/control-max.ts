import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { getRandomId } from '../../helpers';

function controlMax({ max }: Options, onUpdate: Function) {
  const id = getRandomId('rs-max');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Max
      </label>
      <input
        type="number"
        id=${id}
        name="max"
        class="config-panel__input"
        value=${max}
        @input=${onUpdate}
      />
    </div>
  `;
}

export default controlMax;
