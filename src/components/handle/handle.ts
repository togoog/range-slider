import { html, TemplateResult } from 'lit-html';
import { Handle } from '../../types';

function handleView({ origin, position, cssClass }: Handle): TemplateResult {
  const style = `
    ${origin}: ${position.value};
  `;

  return html`
    <div class=${cssClass} style=${style}></div>
  `;
}

export { handleView };
