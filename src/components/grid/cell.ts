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

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
    [`${cssClass}_level-${level}`]: true,
  };

  return html`
    <div
      class=${classMap(cssClasses)}
      style=${styleMap(styles)}
      data-label=${isVisibleLabel ? label : ''}
    ></div>
  `;
}

export { cellView };
