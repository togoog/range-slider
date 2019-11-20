import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Tooltip } from '../../types';
import { convertOrientationToOrigin } from '../../converters';

function tooltipView({
  id,
  orientation,
  position,
  content,
  isVisible,
  hasCollisions,
  role,
  cssClass,
}: Tooltip): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position}%`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
    [`${cssClass}_has-collisions`]: hasCollisions,
    [`${cssClass}_is-hidden`]: !isVisible,
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
