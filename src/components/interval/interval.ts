import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
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

  return html`
    <div class=${cssClass} style=${styleMap(styles)}></div>
  `;
}

export { intervalView };
