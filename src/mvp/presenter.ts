import { pipe, clamp, indexBy, prop } from 'ramda';
import {
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
  HandleId,
  HandleData,
  Data,
} from '../types';
import { Model } from './model';
import View from './view';
import { closestToStep } from '../helpers';
import { convertDataToState, convertOrientationToOrigin } from '../converters';

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

    this.model.on(Model.EVENT_UPDATE, pipe(convertDataToState, renderView));
  }

  private processViewEvents(): void {
    // Bind event handlers to preserve context of Presenter
    const onHandleMoveStart = this.onHandleMoveStart.bind(this);
    const onHandleMove = this.onHandleMove.bind(this);
    const onTooltipCollisions = this.onTooltipCollisions.bind(this);

    this.view.on(View.EVENT_HANDLE_MOVE_START, onHandleMoveStart);
    this.view.on(View.EVENT_HANDLE_MOVE, onHandleMove);
    this.view.on(View.EVENT_TOOLTIP_COLLISIONS, onTooltipCollisions);
  }

  private onHandleMoveStart(handleId: HandleId): void {
    this.model.propose({
      activeHandleId: () => handleId,
    });
  }

  private onHandleMove(
    handleCoords: { x: number; y: number },
    rangeSliderRect: DOMRect,
  ): void {
    this.model.propose({
      handleDict: ({
        min,
        max,
        step,
        orientation,
        handleDict,
        handleIds,
        activeHandleId,
      }: Data) => {
        const handles = handleIds.map(
          (id): HandleData => {
            if (activeHandleId !== id) {
              return handleDict[id];
            }

            // calculate new value for active handle
            const axis = orientation === 'horizontal' ? 'x' : 'y';
            const origin = convertOrientationToOrigin(orientation);
            const dimension = orientation === 'horizontal' ? 'width' : 'height';

            const absPos =
              origin === 'left'
                ? handleCoords[axis] - rangeSliderRect[origin]
                : rangeSliderRect[origin] - handleCoords[axis];
            const relPos = absPos / rangeSliderRect[dimension];
            const absVal = min + (max - min) * relPos;

            return {
              ...handleDict[id],
              value: closestToStep(min, max, step, absVal),
            };
          },
        );

        return indexBy(prop('id'), handles);
      },
    });
  }

  private onTooltipCollisions(collisions: Data['tooltipCollisions']): void {
    this.model.propose({
      tooltipCollisions: () => collisions,
    });
  }
}

export default Presenter;
