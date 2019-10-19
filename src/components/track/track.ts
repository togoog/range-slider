import { html, TemplateResult } from 'lit-html';
import { Track } from '../../types';

function trackView({ cssClass }: Track): TemplateResult {
  return html`
    <div class=${cssClass}></div>
  `;
}

export { trackView };
