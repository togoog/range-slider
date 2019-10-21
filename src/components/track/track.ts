import { html, TemplateResult } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Track } from '../../types';

function trackView({ cssClass }: Track): TemplateResult {
  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)}></div>
  `;
}

export { trackView };
