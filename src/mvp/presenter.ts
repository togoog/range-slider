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
import { convertDataToState, closestToStep } from '../helpers';

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
    const onHandleDragStart = this.onHandleDragStart.bind(this);
    const onHandleDragEnd = this.onHandleDragEnd.bind(this);
    const onHandleDrag = this.onHandleDrag.bind(this);

    this.view.on(View.EVENT_HANDLE_DRAG_START, onHandleDragStart);
    this.view.on(View.EVENT_HANDLE_DRAG_END, onHandleDragEnd);
    this.view.on(View.EVENT_HANDLE_DRAG, onHandleDrag);
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
}

export { Presenter };
