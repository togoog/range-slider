import { propEq, aperture } from 'ramda';
import { EventEmitter } from 'events';
import { render, html, TemplateResult } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import {
  RangeSliderView,
  State,
  Position,
  Coordinates,
  Tooltip,
} from '../types';
import { $, detectRectCollision } from '../helpers';
import {
  trackView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View extends EventEmitter implements RangeSliderView {
  // TODO: rename EVENT_HANDLE... to EVENT_...
  static EVENT_HANDLE_DRAG_START = 'View/Handle/dragStart';
  static EVENT_HANDLE_DRAG_END = 'View/Handle/dragEnd';
  static EVENT_HANDLE_DRAG = 'View/Handle/drag';
  static EVENT_TOOLTIP_COLLISIONS = 'View/TooltipCollisions';

  // mouse pointer offset coords for Handle when dragging
  private handleShiftX = 0;
  private handleShiftY = 0;

  // handle width and height
  private handleWidth = 0;
  private handleHeight = 0;

  // DOM changes observer
  private mutationObserver!: MutationObserver;

  constructor(private el: HTMLElement) {
    super();

    this.listenForDOMChanges();
    this.bindEvents();
  }

  private listenForDOMChanges(): void {
    this.mutationObserver = new MutationObserver(
      this.observeRootElement.bind(this),
    );

    this.mutationObserver.observe(this.el, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['style'],
    });
  }

  private bindEvents(): void {
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

    const tooltips = state.tooltips.map(tooltipView);

    const cssClasses: ClassInfo = {
      [state.cssClass]: true,
    };

    const template = html`
      <div class=${classMap(cssClasses)} data-role="range-slider">
        ${track} ${intervals} ${handles} ${tooltips}
      </div>
    `;

    render(template, this.el);
  }

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

  private detectTooltipsCollisions(): void {
    const tooltipCoordsList = $('[data-role="tooltip"]', this.el)
      .orDefault([])
      .map(tooltip => tooltip.getBoundingClientRect() as DOMRect);

    // if there are more then 1 tooltip -> try to find collisions
    if (tooltipCoordsList.length > 1) {
      const collisions = aperture(2, tooltipCoordsList).flatMap(rects => {
        return detectRectCollision(...rects);
      });

      this.emit(View.EVENT_TOOLTIP_COLLISIONS, collisions);
    }
  }

  private observeRootElement(mutations: MutationRecord[]): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const viewInstance = this;

    // eslint-disable-next-line complexity
    mutations.forEach(mutation => {
      switch (mutation.type) {
        case 'childList':
          if (
            // there should be more then 1 node in the view
            // lit-html adds special nodes. We have to skip them
            mutation.addedNodes.length > 1
          ) {
            viewInstance.detectTooltipsCollisions();
          }
          break;
        case 'attributes':
          const el = mutation.target as HTMLElement;
          const attribute = mutation.attributeName;

          // if style is changed for tooltip - check if collisions occur
          if (attribute === 'style' && el.dataset['role'] === 'tooltip') {
            viewInstance.detectTooltipsCollisions();
          }
          break;
      }
    });
  }
}

export { View };
