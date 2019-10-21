import { render, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { State } from '../types';
import {
  trackView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View implements View {
  constructor(private el: HTMLElement) {}

  render(state: State): void {
    const track = trackView(state.track);
    const intervals = state.intervals.map(intervalView);
    const handles = state.handles.map(handleView);
    const tooltips = state.tooltips.map(tooltipView);

    const cssClasses: ClassInfo = {
      [state.cssClass]: true,
    };

    const template = html`
      <div class=${classMap(cssClasses)}>
        ${track} ${intervals} ${handles} ${tooltips}
      </div>
    `;

    render(template, this.el);
  }
}

export { View };
