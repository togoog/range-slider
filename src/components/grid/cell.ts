import { TemplateResult, html } from 'lit-html';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { GridCell } from '../../types';
import { convertOrientationToOrigin } from '../../services/converters';

function cellView({
  label,
  isVisibleLabel,
  level,
  position,
  orientation,
  cssClass,
  role,
}: GridCell): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position}%`,
  };

  const cellCSSClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}-level-${level}`]: true,
  };

  const labelCSSClasses: ClassInfo = {
    [`${cssClass}-label`]: true,
  };

  const labelHTML = isVisibleLabel
    ? html`
        <span class=${classMap(labelCSSClasses)}>${label}</span>
      `
    : null;

  return html`
    <div
      class=${classMap(cellCSSClasses)}
      style=${styleMap(styles)}
      data-role=${role}
    >
      ${labelHTML}
    </div>
  `;
}

export default cellView;
