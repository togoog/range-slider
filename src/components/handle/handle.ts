import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Handle } from '../../types';

function handleView({ origin, position, cssClass }: Handle): TemplateResult {
  const styles: StyleInfo = {
    [origin]: `${position.value}`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}></div>
  `;
}

export { handleView };
