import { html } from 'lit-html';
import { insert, update } from 'ramda';

import { Options } from '../../../src/types';
import { toArray } from '../../../src/helpers';
import * as defaults from '../../../src/defaults';
import { Config, ElementAttributes } from '../../types';
import { getRandomId, valueFormatter } from '../../helpers';

const defaultAttributes = {
  type: 'number',
  valueFormatter,
  valueParser: parseFloat,
};

function controlValue(
  { options, onUpdate }: Config,
  { type, valueFormatter, valueParser }: ElementAttributes = defaultAttributes,
) {
  const { value } = options;
  const id = getRandomId('rs-value');
  const updateValue = (idx: number) => (e: KeyboardEvent) => {
    e.preventDefault();
    onUpdate(options => {
      const newValue = (e.target as HTMLInputElement).value;

      return {
        ...options,
        value: update(idx, valueParser(newValue), toArray(options.value)),
      };
    });
  };
  const updateValueOnEnter = (idx: number) => (e: KeyboardEvent) =>
    e.keyCode === 13 ? updateValue(idx)(e) : null;

  return html`
    <div class="config-panel__control">
      <label class="config-panel__label">
        Value
      </label>
      <input type="hidden" name="value" value=${JSON.stringify(value)} />
      <div class="config-panel__group">
        ${toArray(options.value).map(
          (v, idx) => html`
            <div class="config-panel__group-item">
              <label class="config-panel__group-item-label">
                ${idx + 1}:
              </label>
              <input
                type=${type}
                id=${id.concat(idx.toString())}
                class="config-panel__input"
                .value=${valueFormatter(v)}
                @keydown=${updateValueOnEnter(idx)}
                @change=${updateValue(idx)}
              />
              <button
                class="config-panel__group-item-btn"
                ?disabled=${toArray(value).length <= 1}
                @click=${() =>
                  onUpdate((options: Options) => {
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
                @click=${() => {
                  onUpdate(options => {
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
