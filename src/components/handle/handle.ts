import { html, TemplateResult } from 'lit-html';
import { Handle } from '../../types';

const className = 'range-slider__handle';

function handleView({ origin, position }: Handle): TemplateResult {
  const style = `
    ${origin}: ${position.value};
  `;

  return html`
    <div class=${className} style=${style}></div>
  `;
}

export { handleView, className };
