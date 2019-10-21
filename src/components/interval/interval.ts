import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Interval } from '../../types';

function intervalView({
  origin,
  from,
  to,
  isVisible,
  cssClass,
}: Interval): TemplateResult {
  // prettier-ignore
  const dimension = 
    ['left', 'right'].includes(origin)
    ? 'width' 
    : 'height';

  const styles: StyleInfo = {
    [origin]: `${from.value}%`,
    [dimension]: `${to.value - from.value}%`,
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}></div>
  `;
}

export { intervalView };
