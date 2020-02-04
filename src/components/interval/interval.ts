import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { html, TemplateResult } from 'lit-html';

import { convertOrientationToOrigin } from '../../services/converters';
import { Interval } from '../../types';

function intervalView({
  id,
  orientation,
  from,
  to,
  cssClass,
  role,
}: Interval): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  // prettier-ignore
  const dimension = 
    ['left', 'right'].includes(origin)
    ? 'width' 
    : 'height';

  const styles: StyleInfo = {
    [origin]: `${from}%`,
    [dimension]: `${to - from}%`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
  };

  return html`
    <div
      class=${classMap(cssClasses)}
      style=${styleMap(styles)}
      data-role=${role}
      data-interval-id=${id}
    ></div>
  `;
}

export default intervalView;
