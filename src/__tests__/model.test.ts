import { Data, Proposal } from '../types';
import { Right } from 'purify-ts/Either';
import { multiply, add, subtract, fromPairs } from 'ramda';
import {
  Model,
  // errors
  errValueNotInRange,
  errValueOrder,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
} from '../mvp/model';

const tooltipFormatter = (value: number) => value.toLocaleString();

describe('Model.checkDataIntegrity', () => {
  test('should contain errMinMax', () => {
    const data: Data = {
      handles: { handle_0: 30 },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 100,
      max: 0,
      step: 500,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true },
      tooltipIds: ['tooltip_0'],
      tooltipFormatter,
      tooltipCollisions: [],
      intervals: { interval_0: true, interval_1: false },
      intervalIds: ['interval_0', 'interval_1'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errMinMax())]),
    );
  });

  test('should contain errValueNotInRange', () => {
    let data: Data = {
      handles: { handle_0: -30 },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true },
      tooltipIds: ['tooltip_0'],
      tooltipFormatter: tooltipFormatter,
      tooltipCollisions: [],
      intervals: { interval_0: true, interval_1: false },
      intervalIds: ['interval_0', 'interval_1'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );

    data = {
      handles: { handle_0: 300 },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter,
      intervals: { interval_0: true, interval_1: false },
      intervalIds: ['interval_0', 'interval_1'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain errStepNotInRange', () => {
    let data: Data = {
      handles: { handle_0: 30 },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 200,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter,
      intervals: { interval_0: true, interval_1: false },
      intervalIds: ['interval_0', 'interval_1'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );

    data = {
      handles: { handle_0: 30 },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: -5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter,
      intervals: { interval_0: true, interval_1: false },
      intervalIds: ['interval_0', 'interval_1'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );
  });

  test(`should contain errTooltipsCount`, () => {
    const data: Data = {
      handles: { handle_0: 30, handle_1: 60 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true, tooltip_2: false },
      tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errTooltipsCount())]),
    );
  });

  test(`should contain errIntervalsCount`, () => {
    const data: Data = {
      handles: { handle_0: 30, handle_1: 60 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true, tooltip_2: false },
      tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2'],
      tooltipCollisions: [],
      tooltipFormatter,
      intervals: {
        interval_0: false,
        interval_1: true,
        interval_2: false,
        interval_3: true,
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2', 'interval_3'],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errIntervalsCount())]),
    );
  });

  test('should return Right(data)', () => {
    const data: Data = {
      handles: { handle_0: 30, handle_1: 60 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    expect(Model.validate(data)).toEqual(Right(data));
  });
});

describe('Model.propose', () => {
  const currentData: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
  };

  test('should change spots', () => {
    const proposal: Partial<Proposal> = {
      handles: (data: Data) =>
        fromPairs(data.handleIds.map(id => [id, data.handles[id] * 2])),
    };
    const model = new Model(currentData);
    expect(model.get('handles')).toEqual({ handle_0: 20, handle_1: 40 });
    model.propose(proposal);
    expect(model.get('handles')).toEqual({ handle_0: 40, handle_1: 80 });
  });

  test('should change min', () => {
    const proposal: Partial<Proposal> = {
      min: (data: Data) => add(data.min, 1),
    };
    const model = new Model(currentData);
    expect(model.get('min')).toEqual(0);
    model.propose(proposal);
    expect(model.get('min')).toEqual(1);
  });

  test('should change max', () => {
    const proposal: Partial<Proposal> = {
      max: (data: Data) => subtract(data.max, 1),
    };
    const model = new Model(currentData);
    expect(model.get('max')).toEqual(100);
    model.propose(proposal);
    expect(model.get('max')).toEqual(99);
  });

  test('should change step', () => {
    const proposal: Partial<Proposal> = {
      step: (data: Data) => add(data.step, 5),
    };
    const model = new Model(currentData);
    expect(model.get('step')).toEqual(5);
    model.propose(proposal);
    expect(model.get('step')).toEqual(10);
  });

  test('should change orientation', () => {
    const proposal: Partial<Proposal> = {
      orientation: (data: Data) =>
        data.orientation == 'horizontal' ? 'vertical' : 'horizontal',
    };
    const model = new Model(currentData);
    expect(model.get('orientation')).toEqual('horizontal');
    model.propose(proposal);
    expect(model.get('orientation')).toEqual('vertical');
  });

  test('should change tooltips', () => {
    const proposal: Partial<Proposal> = {
      tooltips: (data: Data) =>
        fromPairs(data.tooltipIds.map(id => [id, !data.tooltips[id]])),
    };
    const model = new Model(currentData);
    expect(model.get('tooltips')).toEqual({ tooltip_0: true, tooltip_1: true });
    model.propose(proposal);
    expect(model.get('tooltips')).toEqual({
      tooltip_0: false,
      tooltip_1: false,
    });
  });

  test('should emit update event', () => {
    const proposal: Partial<Proposal> = {
      handles: (data: Data) =>
        fromPairs(data.handleIds.map(id => [id, data.handles[id] + 1])),
      min: (data: Data) => subtract(data.min, 10),
      step: (data: Data) => multiply(data.step, 2),
    };
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.propose(proposal);
    expect(updateListener).toHaveBeenCalledWith({
      handles: { handle_0: 21, handle_1: 41 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: -10,
      max: 100,
      step: 10,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    });
  });

  test('should emit validationErrors event when errors can not be fixed', () => {
    const data: Data = {
      handles: { handle_0: 40, handle_1: 70 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    const model = new Model(data);

    const modelListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, modelListener);

    const proposal: Partial<Proposal> = {
      min: (data: Data) => 200,
    };

    model.propose(proposal);

    expect(modelListener).toBeCalledWith([errMinMax()]);
  });
});

describe('Model.get', () => {
  const currentData: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
  };

  test('should return ModelData value by key', () => {
    const model = new Model(currentData);
    expect(model.get('handles')).toEqual({ handle_0: 20, handle_1: 40 });
    expect(model.get('min')).toEqual(0);
    expect(model.get('max')).toEqual(100);
    expect(model.get('step')).toEqual(5);
    expect(model.get('orientation')).toEqual('horizontal');
    expect(model.get('tooltips')).toEqual({ tooltip_0: true, tooltip_1: true });
  });
});

describe('Model.set', () => {
  const currentData: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
  };

  test('should change ModelData value by key', () => {
    const model = new Model(currentData);
    const newHandles = { handle_0: 35, handle_1: 45 };
    model.set('handles', newHandles);
    expect(model.get('handles')).toEqual(newHandles);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.set('step', 20);
    expect(updateListener).toBeCalledWith({
      handles: { handle_0: 20, handle_1: 40 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 20,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: true },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    });
  });

  test('should emit integrityError event', () => {
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, errorListener);
    model.set('step', 200);
    expect(errorListener).toBeCalledWith([errStepNotInRange()]);
  });
});

describe('Model.getAll', () => {
  const currentData: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
  };

  test('should return ModelData object', () => {
    const model = new Model(currentData);
    expect(model.getAll()).toEqual(currentData);
  });
});

describe('Model.setAll', () => {
  const currentData: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
  };

  test('should change ModelData', () => {
    const model = new Model(currentData);
    const newData: Data = {
      handles: { handle_0: 50, handle_1: 70 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: false },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: true, interval_1: false, interval_2: true },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    model.setAll(newData);
    expect(model.getAll()).toEqual(newData);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    const newData: Data = {
      handles: { handle_0: 50, handle_1: 70 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: false },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: true, interval_1: false, interval_2: true },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    model.setAll(newData);
    expect(updateListener).toBeCalledWith(newData);
  });

  test('should emit integrityError event', () => {
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, errorListener);
    const newData: Data = {
      handles: { handle_0: 50, handle_1: 70 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 300,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltips: { tooltip_0: true, tooltip_1: false },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: tooltipFormatter,
      intervals: { interval_0: true, interval_1: false, interval_2: true },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    };
    model.setAll(newData);
    expect(errorListener).toBeCalledWith([errStepNotInRange()]);
  });
});
