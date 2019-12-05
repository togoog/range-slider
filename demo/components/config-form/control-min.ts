import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { getRandomId } from '../../helpers';

function controlMin({ min }: Options, onUpdate: Function) {
  const id = getRandomId('rs-min');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Min
      </label>
      <input
        type="number"
        id=${id}
        name="min"
        class="config-panel__input"
        value=${min}
        @input=${onUpdate}
      />
    </div>
  `;
}

export default controlMin;
