import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlOrientation({ options, onUpdate }: Config) {
  const { orientation } = options;
  const id = getRandomId('rs-orientation');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Orientation
      </label>
      <select
        class="config-panel__select"
        id=${id}
        @change=${(e: Event) =>
          onUpdate(options => {
            const newValue = (e.target as HTMLInputElement).value;
            return assoc('orientation', newValue, options);
          })}
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
