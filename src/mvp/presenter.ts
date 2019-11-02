import { pipe, not, clamp } from 'ramda';
import {
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
  Proposal,
  Data,
  Position,
  Coordinates,
} from '../types';
import { Model, View } from './index';
import { convertDataToState, closestToStep, arraysMatch } from '../helpers';

class Presenter implements RangeSliderPresenter {
  constructor(private model: RangeSliderModel, private view: RangeSliderView) {
    this.processModelEvents();
    this.processViewEvents();

    this.startApp();
  }

  startApp(): void {
    const state = convertDataToState(this.model.getAll());
    this.view.render(state);
  }

  private processModelEvents(): void {
    const renderView = this.view.render.bind(this.view);

    this.model.on(
      Model.EVENT_UPDATE,
      pipe(
        convertDataToState,
        renderView,
      ),
    );
  }

  private processViewEvents(): void {
    // Bind event handlers to preserve context of Presenter
    const onHandleDragStart = this.onHandleDragStart.bind(this);
    const onHandleDragEnd = this.onHandleDragEnd.bind(this);
    const onHandleDrag = this.onHandleDrag.bind(this);
    const onTooltipCollisions = this.onTooltipCollisions.bind(this);

    this.view.on(View.EVENT_HANDLE_DRAG_START, onHandleDragStart);
    this.view.on(View.EVENT_HANDLE_DRAG_END, onHandleDragEnd);
    this.view.on(View.EVENT_HANDLE_DRAG, onHandleDrag);
    this.view.on(View.EVENT_TOOLTIP_COLLISIONS, onTooltipCollisions);
  }

  private onHandleDragStart(position: Position): void {
    this.model.propose({
      activeSpotIds: () => [position.id],
    });
  }

  private onHandleDragEnd(): void {
    this.model.propose({
      activeSpotIds: () => [],
    });
  }

  private onHandleDrag(
    handleCoords: Coordinates,
    rangeSliderRect: ClientRect,
  ): void {
    this.model.propose({
      spots: data => {
        // eslint-disable-next-line complexity
        return data.spots.map(spot => {
          if (not(data.activeSpotIds.includes(spot.id))) {
            return { ...spot };
          }

          // calculate new value for active spot
          const axis = data.orientation === 'horizontal' ? 'x' : 'y';
          const origin = data.orientation === 'horizontal' ? 'left' : 'top';
          const dimension =
            data.orientation === 'horizontal' ? 'width' : 'height';

          const absPos = handleCoords[axis] - rangeSliderRect[origin];
          const relPos = absPos / rangeSliderRect[dimension];
          const absVal = data.min + (data.max - data.min) * relPos;

          return {
            ...spot,
            value: clamp(data.min, data.max, closestToStep(data.step, absVal)),
          };
        });
      },
    });
  }

  private onTooltipCollisions(collisions: boolean[]): void {
    if (!arraysMatch(collisions, this.model.get('tooltipCollisions'))) {
      this.model.propose({
        tooltipCollisions: () => [...collisions],
      });
    }
  }
}

export { Presenter };
