import { html, TemplateResult } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Track } from '../../types';

function trackView({ cssClass, role }: Track): TemplateResult {
  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} data-role=${role}></div>
  `;
}

export default trackView;
