import { html, TemplateResult } from 'lit-html';
import { Interval } from '../../types';

function intervalView({
  origin,
  from,
  to,
  isVisible,
  cssClass,
}: Interval): TemplateResult {
  // prettier-ignore
  const dimension = 
    ['left', 'right'].includes(origin)
    ? 'width' 
    : 'height';

  const style = `
    ${origin}: ${from.value}%; 
    ${dimension}: ${to.value - from.value}%;
    display: ${isVisible ? 'block' : 'none'};
  `;

  return html`
    <div class=${cssClass} style=${style}></div>
  `;
}

export { intervalView };
