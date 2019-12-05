import { html } from 'lit-html';
import { Options } from '../../../src/types';
import { toArray } from '../../../src/helpers';
import { getRandomId, valueFormatter } from '../../helpers';

function controlIntervals(
  { value, min, max, step, intervals }: Options,
  onUpdate: Function,
) {
  const id = getRandomId('intervals');
  const values = toArray(value);

  return html`
    <div class="config-panel__control">
      <label class="config-panel__label">
        Intervals
      </label>
      <div class="config-panel__group">
        ${toArray(intervals).map((isChecked, idx) => {
          const leftValue = values[idx - 1] || min;
          const rightValue = values[idx] || max;

          return html`
            <div class="config-panel__group-item">
              <label class="config-panel__group-item-label">
                ${idx + 1}:
              </label>
              <input
                type="checkbox"
                id=${id.concat(idx.toString())}
                name="intervals"
                class="config-panel__group-item-checkbox"
                value=${isChecked}
                ?checked=${isChecked}
                @input=${onUpdate}
              />
              <span class="config-panel__group-item-desc">
                between
                <code
                  >${step === 0 ? valueFormatter(leftValue) : leftValue}</code
                >
                and
                <code
                  >${step === 0 ? valueFormatter(rightValue) : rightValue}</code
                >
              </span>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}

export default controlIntervals;
