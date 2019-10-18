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
    const intervals = state.intervals.map(intervalState =>
      intervalView(state.origin, intervalState),
    );
    const handles = state.handles.map(handleState =>
      handleView(state.origin, handleState),
    );
    const tooltips = state.tooltips.map(tooltipState =>
      tooltipView(state.origin, tooltipState),
    );

    const template = html`
      <div class=${View.cssClass}>
        ${track} ${intervals} ${handles} ${tooltips}
      </div>
    `;

    render(template, this.el);
  }
}

export { View };
