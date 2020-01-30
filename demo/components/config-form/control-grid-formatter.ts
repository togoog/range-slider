import { html } from 'lit-html';
import { assoc } from 'ramda';
import { Config } from '../../types';
import { getRandomId, getFunctionAsText } from '../../helpers';

function controlGridFormatter({ options, onUpdate }: Config) {
  const { gridFormatter } = options;
  const id = getRandomId('rs-grid-formatter');

  return html`
    <div class="config-panel__control">
      <label for=${id} class="config-panel__label">
        Grid Formatter Function
      </label>
      <textarea
        id=${id}
        class="config-panel__textarea"
        rows="6"
        @change=${(e: Event) =>
          onUpdate(e, options => {
            const newFnBody = (e.target as HTMLTextAreaElement).value;
            // eslint-disable-next-line no-new-func
            const newFn = new Function('value', newFnBody);
            return assoc('gridFormatter', newFn, options);
          })}
      >
${getFunctionAsText(gridFormatter)}
      </textarea
      >
    </div>
  `;
}

export default controlGridFormatter;
