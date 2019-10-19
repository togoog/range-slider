import { html, TemplateResult } from 'lit-html';
import { Tooltip } from '../../types';

function tooltipView({
  origin,
  position,
  content,
  isVisible,
  cssClass,
}: Tooltip): TemplateResult {
  const style = `
    ${origin}: ${position.value}%;
    display: ${isVisible ? 'block' : 'none'};
  `;

  return html`
    <div class=${cssClass} style=${style}>
      ${content}
    </div>
  `;
}

export { tooltipView };
