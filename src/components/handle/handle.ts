import { convertOrientationToOrigin } from '../../helpers';
import { html, TemplateResult } from 'lit-html';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { Handle, Position } from '../../types';

type Actions = {
  onMouseDown: (position: Position, e: MouseEvent) => void;
};

function handleView(
  { orientation, position, cssClass, isActive }: Handle,
  actions: Actions,
): TemplateResult {
  const origin = convertOrientationToOrigin(orientation);

  const styles: StyleInfo = {
    [origin]: `${position.value}%`,
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
    [`${cssClass}_is-active`]: isActive,
  };

  return html`
    <div
      class=${classMap(cssClasses)}
      style=${styleMap(styles)}
      @dragstart=${() => false}
      @mousedown=${(e: MouseEvent) => actions.onMouseDown(position, e)}
    ></div>
  `;
}

export { handleView, Actions };
