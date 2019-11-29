import { TemplateResult, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Grid } from '../../types';
import cellView from './cell';

function gridView({ cells, isVisible, cssClass, role }: Grid): TemplateResult {
  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_is-hidden`]: !isVisible,
  };

  return html`
    <div class=${classMap(cssClasses)} data-role=${role}>
      <div class="${cssClass}-line"></div>
      ${cells.map(cellView)}
    </div>
  `;
}

export default gridView;
