import { render, html } from 'lit-html';
import { State } from '../types';
import {
  trackView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View implements View {
  static cssClass = 'range-slider';

  constructor(private el: HTMLElement) {}

  render(state: State): void {
    const track = trackView();
    const intervals = state.intervals.map(intervalView);
    const handles = state.handles.map(handleView);
    const tooltips = state.tooltips.map(tooltipView);

    const template = html`
      <div class=${View.cssClass}>
        ${track} ${intervals} ${handles} ${tooltips}
      </div>
    `;

    render(template, this.el);
  }
}

export { View };
