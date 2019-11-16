import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Interval } from '../../types';
import { convertOrientationToOrigin } from '../../converters';

function intervalView({
  id,
  orientation,
  from,
  to,
  cssClass,
  isVisible,
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
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
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
