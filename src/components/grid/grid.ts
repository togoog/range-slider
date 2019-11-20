import { TemplateResult, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { Grid } from '../../types';
import cellView from './cell';

function gridView({
  cells,
  isVisible,
  cssClass,
  orientation,
}: Grid): TemplateResult {
  const styles: StyleInfo = {
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}>
      ${cells.map(cellView)}
    </div>
  `;
}

export default gridView;
