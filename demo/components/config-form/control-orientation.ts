import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { getRandomId } from '../../helpers';

function controlOrientation({ orientation }: Options, onUpdate: Function) {
  const id = getRandomId('rs-orientation');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Orientation
      </label>
      <select
        class="config-panel__select"
        id=${id}
        name="orientation"
        @change=${onUpdate}
      >
        <option value="horizontal" ?selected=${orientation === 'horizontal'}
          >Horizontal</option
        >
        <option value="vertical" ?selected=${orientation === 'vertical'}
          >Vertical</option
        >
      </select>
    </div>
  `;
}

export default controlOrientation;
