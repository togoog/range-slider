import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { toArray } from '../../../src/helpers';
import { getRandomId, valueFormatter } from '../../helpers';

function controlTooltips(
  { value, step, tooltips }: Options,
  onUpdate: Function,
) {
  const id = getRandomId('rs-tooltip');

  return html`
    <div class="config-panel__control">
      <label class="config-panel__label">
        Tooltips
      </label>
      <div class="config-panel__group">
        ${toArray(tooltips).map(
          (isChecked, idx) => html`
            <div class="config-panel__group-item">
              <label class="config-panel__group-item-label">
                ${idx + 1}:
              </label>
              <input
                type="checkbox"
                id=${id.concat(idx.toString())}
                name="tooltips"
                class="config-panel__group-item-checkbox"
                value=${isChecked}
                ?checked=${isChecked}
                @input=${onUpdate}
              />
              <span class="config-panel__group-item-desc">
                for value:
                <code
                  >${step === 0
                    ? valueFormatter(toArray(value)[idx])
                    : toArray(value)[idx]}</code
                >
              </span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export default controlTooltips;
