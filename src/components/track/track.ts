import { html, TemplateResult } from 'lit-html';

const className = 'range-slider__track';

function trackView(): TemplateResult {
  return html`
    <div class=${className}></div>
  `;
}

export { trackView, className };
