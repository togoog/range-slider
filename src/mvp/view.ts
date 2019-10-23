import { EventEmitter } from 'events';
import { render, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { State, Position } from '../types';
import {
  trackView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View extends EventEmitter implements View {
  static EVENT_HANDLE_DRAG_START = 'View/Handle/dragStart';
  static EVENT_HANDLE_DRAG_END = 'View/Handle/dragEnd';
  static EVENT_HANDLE_DRAG = 'View/Handle/drag';

  // mouse pointer offset coords for Handle when dragging
  private handleShiftX = 0;
  private handleShiftY = 0;

  constructor(private el: HTMLElement) {
    super();
  }

  render(state: State): void {
    const track = trackView(state.track);
    const intervals = state.intervals.map(intervalView);
    const handles = state.handles.map(state =>
      handleView(state, {
        onMouseDown: this.onHandleMouseDown,
      }),
    );
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

  onHandleMouseDown = (position: Position) => (e: MouseEvent): void => {
    e.preventDefault();

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.handleShiftX = e.clientX - rect.left;
    this.handleShiftY = e.clientY - rect.top;

    document.addEventListener('mousemove', this.onHandleMove);
    document.addEventListener('mouseup', this.onHandleMouseUp);

    this.emit(View.EVENT_HANDLE_DRAG_START, position);
  };

  onHandleMouseUp = (e: MouseEvent): void => {
    e.preventDefault();

    this.handleShiftX = 0;
    this.handleShiftY = 0;

    document.removeEventListener('mousemove', this.onHandleMove);
    document.removeEventListener('mouseup', this.onHandleMouseUp);

    this.emit(View.EVENT_HANDLE_DRAG_END);
  };

  onHandleMove = (e: MouseEvent): void => {
    e.preventDefault();

    const newHandlePosition = {
      x: e.clientX - this.handleShiftX,
      y: e.clientY - this.handleShiftY,
    };

    const rangeSliderRect = this.el.getBoundingClientRect();

    this.emit(View.EVENT_HANDLE_DRAG, newHandlePosition, rangeSliderRect);
  };
}

export { View };
