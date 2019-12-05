import { html } from 'lit-html';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { Options } from '../../../src/types';
import * as defaults from '../../../src/defaults';
import { getRandomId } from '../../helpers';

function controlGrid({ grid }: Options, onUpdate: Function) {
  let isVisible = defaults.gridIsVisible;
  let numCells = defaults.gridNumCells;

  if (typeof grid !== 'boolean') {
    isVisible = grid.isVisible;
    numCells = grid.numCells;
  }

  const isVisibleId = getRandomId('grid-is-visible');
  const numCellsId = getRandomId('grid-num-cells');

  const numCellsClass: ClassInfo = {
    'config-panel__control': true,
    'config-panel__control_hidden': !isVisible,
  };

  return html`
    <div class="config-panel__control">
      <label for=${isVisibleId} class="config-panel__label">
        Show Grid
      </label>
      <input
        type="checkbox"
        id=${isVisibleId}
        name="grid.isVisible"
        class="config-panel__checkbox"
        value=${isVisible}
        ?checked=${isVisible}
        @input=${onUpdate}
      />
    </div>

    <div class=${classMap(numCellsClass)}>
      <label class="config-panel__label">
        Grid Number of Cells
      </label>
      <div class="config-panel__group">
        ${numCells.map(
          (value, idx) => html`
            <div class="config-panel__group-item">
              <label class="config-panel__group-item-label">
                ${idx + 1}:
              </label>
              <input
                type="number"
                min="1"
                id=${numCellsId.concat(idx.toString())}
                name="grid.numCells"
                class="config-panel__input"
                value=${value}
                @input=${onUpdate}
              />
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export default controlGrid;
