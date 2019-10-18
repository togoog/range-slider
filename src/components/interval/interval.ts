import { html, TemplateResult } from 'lit-html';
import { Interval, Origin } from '../../types';

const className = 'range-slider__interval';

function intervalView(
  origin: Origin,
  { from, to, isVisible }: Interval,
): TemplateResult {
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
    <div class="${className}" style="${style}"></div>
  `;
}

export { intervalView, className };
