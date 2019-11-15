import { TemplateResult, html } from 'lit-html';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { GridCell } from '../../types';
import { convertOrientationToOrigin } from '../../converters';

function cellView({
  label,
  isVisibleLabel,
  level,
  position,
  orientation,
  cssClass,
}: GridCell): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position}%`,
  };

  const cellCSSClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
    [`${cssClass}_${orientation}-level-${level}`]: true,
  };

  const labelCSSClasses: ClassInfo = {
    [`${cssClass}-label`]: true,
    [`${cssClass}-label_${orientation}`]: true,
    [`${cssClass}-label_${orientation}-level-${level}`]: true,
  };

  const labelHTML = isVisibleLabel
    ? html`
        <span class=${classMap(labelCSSClasses)}>${label}</span>
      `
    : null;

  return html`
    <div class=${classMap(cellCSSClasses)} style=${styleMap(styles)}>
      ${labelHTML}
    </div>
  `;
}

export { cellView };
