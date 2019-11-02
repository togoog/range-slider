import { convertOrientationToOrigin } from '../../helpers';
import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Tooltip } from '../../types';

function tooltipView({
  orientation,
  position,
  content,
  isVisible,
  role = 'tooltip',
  cssClass,
  hasCollisions,
}: Tooltip): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position.value}%`,
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
    [`${cssClass}_has-collisions`]: hasCollisions,
  };

  return html`
    <div
      class=${classMap(cssClasses)}
      style=${styleMap(styles)}
      data-role=${role}
    >
      ${content}
    </div>
  `;
}

export { tooltipView };
