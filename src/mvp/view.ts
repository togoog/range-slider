import { propEq, aperture } from 'ramda';
import { EventEmitter } from 'events';
import { render, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { RangeSliderView, State, Position, Coordinates } from '../types';
import { $, detectRectCollision } from '../helpers';
import {
  trackView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View extends EventEmitter implements RangeSliderView {
  static EVENT_HANDLE_DRAG_START = 'View/Handle/dragStart';
  static EVENT_HANDLE_DRAG_END = 'View/Handle/dragEnd';
  static EVENT_HANDLE_DRAG = 'View/Handle/drag';

  // mouse pointer offset coords for Handle when dragging
  private handleShiftX = 0;
  private handleShiftY = 0;

  // handle width and height
  private handleWidth = 0;
  private handleHeight = 0;

  constructor(private el: HTMLElement) {
    super();

    this.onHandleMouseDown = this.onHandleMouseDown.bind(this);
    this.onHandleMouseUp = this.onHandleMouseUp.bind(this);
    this.onHandleMove = this.onHandleMove.bind(this);
  }

  render(state: State): void {
    const track = trackView(state.track);
    const intervals = state.intervals
      .filter(propEq('isVisible', true))
      .map(intervalView);
    const handles = state.handles.map(state =>
      handleView(state, {
        onMouseDown: this.onHandleMouseDown,
      }),
    );
    const tooltips = state.tooltips
      .filter(propEq('isVisible', true))
      .map(tooltipView);

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

  // private resolveTooltipCollisions(tooltipSelector: string): void {
  //   const tooltips = document.querySelectorAll(tooltipSelector);
  //   console.log(tooltips, tooltipSelector);
  // }

  onHandleMouseDown(position: Position, e: MouseEvent): void {
    e.preventDefault();

    document.addEventListener('mousemove', this.onHandleMove);
    document.addEventListener('mouseup', this.onHandleMouseUp);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.handleShiftX = e.clientX - rect.left;
    this.handleShiftY = e.clientY - rect.top;
    this.handleWidth = rect.width;
    this.handleHeight = rect.height;

    this.emit(View.EVENT_HANDLE_DRAG_START, position);
  }

  onHandleMouseUp(e: MouseEvent): void {
    e.preventDefault();

    this.handleShiftX = 0;
    this.handleShiftY = 0;
    this.handleWidth = 0;
    this.handleHeight = 0;

    document.removeEventListener('mousemove', this.onHandleMove);
    document.removeEventListener('mouseup', this.onHandleMouseUp);

    this.emit(View.EVENT_HANDLE_DRAG_END);
  }

  onHandleMove(e: MouseEvent): void {
    e.preventDefault();

    // Handle center coordinates
    const handleCoords: Coordinates = {
      x: e.clientX - this.handleShiftX + this.handleWidth / 2,
      y: e.clientY - this.handleShiftY + this.handleHeight / 2,
    };

    const rangeSliderRect = this.el.getBoundingClientRect();

    this.emit(View.EVENT_HANDLE_DRAG, handleCoords, rangeSliderRect);
  }
}

export { View };
