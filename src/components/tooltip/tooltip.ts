import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Tooltip } from '../../types';

function tooltipView({
  origin,
  position,
  content,
  isVisible,
  cssClass,
}: Tooltip): TemplateResult {
  const styles: StyleInfo = {
    [origin]: `${position.value}%`,
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}>
      ${content}
    </div>
  `;
}

export { tooltipView };
