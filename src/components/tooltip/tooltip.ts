import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
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

  return html`
    <div class=${cssClass} style=${styleMap(styles)}>
      ${content}
    </div>
  `;
}

export { tooltipView };
