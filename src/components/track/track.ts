import { html, TemplateResult } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Track } from '../../types';

function trackView({ cssClass, orientation }: Track): TemplateResult {
  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
  };

  return html`
    <div class=${classMap(cssClasses)}></div>
  `;
}

export default trackView;
