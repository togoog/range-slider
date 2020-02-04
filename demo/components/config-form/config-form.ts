import { html } from 'lit-html';

import { Config, ConfigFormElement } from '../../types';

function configForm(config: Config, elements?: ConfigFormElement[]) {
  return html`
    <h2 class="config-panel__header">Config Panel</h2>
    <form
      action="#"
      class="config-panel__form"
      @submit=${(e: MouseEvent) => e.preventDefault()}
    >
      ${elements && elements.map(element => element(config))}
    </form>
  `;
}

export default configForm;
