import { html } from 'lit-html';
import { insert } from 'ramda';
import { Options } from '../../../src/types';
import { toArray } from '../../../src/helpers';
import * as defaults from '../../../src/defaults';
import { getRandomId, valueFormatter } from '../../helpers';

function controlValue({ value, step }: Options, onUpdate: Function) {
  const id = getRandomId('rs-value');

  return html`
    <div class="config-panel__control">
      <label class="config-panel__label">
        Value
      </label>
      <div class="config-panel__group">
        ${toArray(value).map(
          (v, idx) => html`
            <div class="config-panel__group-item">
              <label class="config-panel__group-item-label">
                ${idx + 1}:
              </label>
              <input
                type="number"
                id=${id.concat(idx.toString())}
                name="value"
                class="config-panel__group-item-input"
                value=${step === 0 ? valueFormatter(v) : v}
                @input=${onUpdate}
              />
              <button
                class="config-panel__group-item-btn"
                ?disabled=${toArray(value).length <= 1}
                @click=${(e: MouseEvent) =>
                  onUpdate(e, (options: Options) => {
                    if (toArray(options.value).length <= 1) {
                      return options;
                    }

                    return {
                      ...options,
                      value: toArray(options.value).filter((_, i) => i !== idx),
                      tooltips: toArray(options.tooltips).filter(
                        (_, i) => i !== idx,
                      ),
                      intervals: toArray(options.intervals).filter(
                        (_, i) => i !== idx,
                      ),
                    };
                  })}
              >
                Del
              </button>
              <button
                class="config-panel__group-item-btn"
                @click=${(e: MouseEvent) => {
                  onUpdate(e, (options: Options) => {
                    const values = toArray(options.value);
                    const currentValue = values[idx];
                    const nextValue = values[idx + 1] || options.max;

                    return {
                      ...options,
                      value: insert(
                        idx + 1,
                        (currentValue + nextValue) / 2,
                        toArray(options.value),
                      ),
                      tooltips: insert(
                        idx + 1,
                        defaults.tooltipValue,
                        toArray(options.tooltips),
                      ),
                      intervals: insert(
                        idx + 1,
                        defaults.intervalValue,
                        toArray(options.intervals),
                      ),
                    };
                  });
                }}
              >
                Add
              </button>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export default controlValue;
