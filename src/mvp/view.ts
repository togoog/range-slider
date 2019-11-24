import { aperture, prop } from 'ramda';
import { isNotEmpty } from 'ramda-adjunct';
import { EventEmitter } from 'events';
import { render, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { RangeSliderView, State, TooltipId, HandleId } from '../types';
import { selectElements, haveCollisions, createId } from '../helpers';
import {
  trackView,
  gridView,
  intervalView,
  handleView,
  tooltipView,
} from '../components';

class View extends EventEmitter implements RangeSliderView {
  static EVENT_HANDLE_MOVE_START = 'RangeSlider/View/handleMoveStart';

  static EVENT_HANDLE_MOVE_END = 'RangeSlider/View/handleMoveEnd';

  static EVENT_HANDLE_MOVE = 'RangeSlider/View/handleMove';

  static EVENT_TOOLTIP_COLLISIONS = 'RangeSlider/View/tooltipCollisions';

  // mouse pointer offset X coordinate for Handle when dragging
  private handleShiftX = 0;

  // mouse pointer offset Y coordinate for Handle when dragging
  private handleShiftY = 0;

  private handleWidth = 0;

  private handleHeight = 0;

  // DOM changes observer
  private mutationObserver!: MutationObserver;

  constructor(private el: HTMLElement) {
    super();

    this.listenForDOMChanges();
    this.bindEvents();
  }

  render(state: State): void {
    const { cssClass } = state;
    const { orientation } = state.track;

    const track = trackView(state.track);
    const grid = state.grid.isVisible ? gridView(state.grid) : '';
    const intervals = state.intervals
      .filter(prop('isVisible'))
      .map(intervalView);
    const handles = state.handles.map(handleState =>
      handleView(handleState, {
        onMouseDown: this.onHandleMouseDown,
      }),
    );
    const tooltips = state.tooltips.filter(prop('isVisible')).map(tooltipView);

    const cssClasses: ClassInfo = {
      [cssClass]: true,
      [`${cssClass}_${orientation}`]: true,
    };

    const template = html`
      <div class=${classMap(cssClasses)} data-role="range-slider">
        ${track} ${grid} ${intervals} ${handles} ${tooltips}
      </div>
    `;

    render(template, this.el);
  }

  onHandleMouseDown(handleId: HandleId, e: MouseEvent): void {
    e.preventDefault();

    document.addEventListener('mousemove', this.onHandleMove);
    document.addEventListener('mouseup', this.onHandleMouseUp);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.handleShiftX = e.clientX - rect.left;
    this.handleShiftY = e.clientY - rect.top;
    this.handleWidth = rect.width;
    this.handleHeight = rect.height;

    this.emit(View.EVENT_HANDLE_MOVE_START, handleId);
  }

  onHandleMouseUp(e: MouseEvent): void {
    e.preventDefault();

    this.handleShiftX = 0;
    this.handleShiftY = 0;
    this.handleWidth = 0;
    this.handleHeight = 0;

    document.removeEventListener('mousemove', this.onHandleMove);
    document.removeEventListener('mouseup', this.onHandleMouseUp);

    this.emit(View.EVENT_HANDLE_MOVE_END);
  }

  onHandleMove(e: MouseEvent): void {
    e.preventDefault();

    const handleCenterCoords = {
      x: e.clientX - this.handleShiftX + this.handleWidth / 2,
      y: e.clientY - this.handleShiftY + this.handleHeight / 2,
    };

    const rangeSliderRect = this.el.getBoundingClientRect();

    this.emit(View.EVENT_HANDLE_MOVE, handleCenterCoords, rangeSliderRect);
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

  private detectTooltipsCollisions(): void {
    const tooltipCoordsList = selectElements('[data-role="tooltip"]', this.el)
      .orDefault([])
      .map((tooltip, idx): [TooltipId, DOMRect] => [
        tooltip.getAttribute('data-tooltip-id') || createId('tooltip', idx),
        tooltip.getBoundingClientRect() as DOMRect,
      ]);

    // if there are more then 1 tooltip -> try to find collisions
    if (tooltipCoordsList.length > 1) {
      const collisions = aperture(2, tooltipCoordsList)
        .map(adjacentTooltips => {
          const [firstId, firstRect] = adjacentTooltips[0];
          const [secondId, secondRect] = adjacentTooltips[1];

          return haveCollisions(firstRect, secondRect)
            ? [firstId, secondId]
            : [];
        })
        .filter(isNotEmpty)
        .reduce((acc, cur): TooltipId[][] => {
          const prevGroup = acc[acc.length - 1];
          const prevTooltipId = prevGroup
            ? prevGroup[prevGroup.length - 1]
            : null;

          if (prevTooltipId === cur[0]) {
            prevGroup.push(cur[1]);
          } else {
            acc.push(cur);
          }

          return acc;
        }, [] as TooltipId[][]);

      this.emit(View.EVENT_TOOLTIP_COLLISIONS, collisions);
    }
  }

  private observeRootElement(mutations: MutationRecord[]): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const viewInstance = this;

    // eslint-disable-next-line complexity
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        if (
          // there should be more then 1 node in the view
          // lit-html adds special nodes. We have to skip them
          mutation.addedNodes.length > 1
        ) {
          viewInstance.detectTooltipsCollisions();
        }
      }

      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'style'
      ) {
        const el = mutation.target as HTMLElement;

        // if style is changed for tooltip - check if collisions occur
        if (el.getAttribute('data-role') === 'tooltip') {
          viewInstance.detectTooltipsCollisions();
        }
      }
    });
  }
}

export default View;
