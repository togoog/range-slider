import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { TemplateResult, html } from 'lit-html';

import { Grid } from '../../types';
import cellView from './cell';

function gridView({ cells, cssClass, role }: Grid): TemplateResult {
  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} data-role=${role}>
      <div class="${cssClass}-line"></div>
      <div class="${cssClass}-cells">
        ${cells.map(cellView)}
      </div>
    </div>
  `;
}

export default gridView;
