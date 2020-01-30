import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Tooltip } from '../../types';
import { convertOrientationToOrigin } from '../../services/converters';

function tooltipView({
  id,
  orientation,
  position,
  content,
  hasCollisions,
  cssClass,
  role,
}: Tooltip): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position}%`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_has-collisions`]: hasCollisions,
  };

  return html`
    <div
      class=${classMap(cssClasses)}
      style=${styleMap(styles)}
      data-role=${role}
      data-tooltip-id=${id}
    >
      ${content}
    </div>
  `;
}

export default tooltipView;
