import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { Handle } from '../../types';

function handleView({ origin, position, cssClass }: Handle): TemplateResult {
  const styles: StyleInfo = {
    [origin]: `${position.value}`,
  };

  return html`
    <div class=${cssClass} style=${styleMap(styles)}></div>
  `;
}

export { handleView };
