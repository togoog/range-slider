import { convertOrientationToOrigin } from '../../helpers';
import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Interval } from '../../types';

function intervalView({
  orientation,
  from,
  to,
  cssClass,
}: Interval): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  // prettier-ignore
  const dimension = 
    ['left', 'right'].includes(origin)
    ? 'width' 
    : 'height';

  const styles: StyleInfo = {
    [origin]: `${from.value}%`,
    [dimension]: `${to.value - from.value}%`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
  };

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}></div>
  `;
}

export { intervalView };
