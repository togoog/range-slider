import { pipe } from 'ramda';
import {
  RangeSliderModel,
  RangeSliderView,
  RangeSliderPresenter,
} from '../types';
import { Model, View } from '.';
import { convertDataToState } from '../helpers';

class Presenter implements RangeSliderPresenter {
  constructor(private model: RangeSliderModel, private view: RangeSliderView) {
    const renderView = this.view.render.bind(view);

    this.model.on(
      Model.EVENT_UPDATE,
      pipe(
        convertDataToState,
        renderView,
      ),
    );

    this.startApp();
  }

  startApp(): void {
    const state = convertDataToState(this.model.getAll());
    this.view.render(state);
  }
}

export { Presenter };
