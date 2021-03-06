import { html } from 'lit-html';
import { assoc, update } from 'ramda';

import formatValue from '../../../src/services/formatter';
import { toArray } from '../../../src/helpers';
import { Config } from '../../types';
import { getRandomId } from '../../helpers';

function controlTooltips({ options, onUpdate }: Config) {
  const { tooltips, value, tooltipFormat } = options;
  const id = getRandomId('rs-tooltip');
  const values = toArray(value);

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
                class="config-panel__group-item-checkbox"
                value=${isChecked}
                ?checked=${isChecked}
                @change=${(e: Event) =>
                  onUpdate(options => {
                    const newValue = (e.target as HTMLInputElement).checked;
                    const newTooltips = update(
                      idx,
                      newValue,
                      toArray(options.tooltips),
                    );
                    return assoc('tooltips', newTooltips, options);
                  })}
              />
              <span class="config-panel__group-item-desc">
                for value:
                <code>${formatValue(tooltipFormat, values[idx])}</code>
              </span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export default controlTooltips;
