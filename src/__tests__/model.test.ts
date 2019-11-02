import { Data, Proposal, Spot } from '../types';
import { Right } from 'purify-ts/Either';
import { not, multiply, add, subtract, evolve, identity } from 'ramda';
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

const tooltipsFormatter = (value: number) => value.toLocaleString();

describe('Model.checkDataIntegrity', () => {
  test('should contain errMinMax', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }],
      activeSpotIds: [],
      min: 100,
      max: 0,
      step: 500,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipsFormatter,
      tooltipCollisions: [],
      intervals: [true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errMinMax())]),
    );
  });

  test('should contain errValueNotInRange', () => {
    let data: Data = {
      spots: [{ id: 'value_0', value: -30 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipsFormatter,
      tooltipCollisions: [],
      intervals: [true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );

    data = {
      spots: [{ id: 'value_0', value: 300 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain errStepNotInRange', () => {
    let data: Data = {
      spots: [{ id: 'value_0', value: 30 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 200,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );

    data = {
      spots: [{ id: 'value_0', value: 30 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: -5,
      orientation: 'horizontal',
      tooltips: [true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );
  });

  test(`should contain errTooltipsCount`, () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }, { id: 'value_1', value: 60 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errTooltipsCount())]),
    );
  });

  test(`should contain errIntervalsCount`, () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }, { id: 'value_1', value: 60 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false, true],
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errIntervalsCount())]),
    );
  });

  test('should return Right(data)', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }, { id: 'value_1', value: 60 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };
    expect(Model.validate(data)).toEqual(Right(data));
  });
});

describe('Model.propose', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipsFormatter,
    intervals: [false, true, false],
  };

  test('should change spots', () => {
    const proposal: Partial<Proposal> = {
      spots: (data: Data) =>
        data.spots.map(
          evolve({
            id: identity,
            value: multiply(2),
          }),
        ) as Spot[],
    };
    const model = new Model(currentData);
    expect(model.get('spots')).toEqual([
      { id: 'value_0', value: 20 },
      { id: 'value_1', value: 40 },
    ]);
    model.propose(proposal);
    expect(model.get('spots')).toEqual([
      { id: 'value_0', value: 40 },
      { id: 'value_1', value: 80 },
    ]);
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
      tooltips: (data: Data) => data.tooltips.map(not),
    };
    const model = new Model(currentData);
    expect(model.get('tooltips')).toEqual([true, true]);
    model.propose(proposal);
    expect(model.get('tooltips')).toEqual([false, false]);
  });

  test('should emit update event', () => {
    const proposal: Partial<Proposal> = {
      spots: (data: Data) =>
        data.spots.map(
          evolve({
            id: identity,
            value: add(1),
          }),
        ) as Spot[],
      min: (data: Data) => subtract(data.min, 10),
      step: (data: Data) => multiply(data.step, 2),
    };
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.propose(proposal);
    expect(updateListener).toHaveBeenCalledWith({
      spots: [{ id: 'value_0', value: 21 }, { id: 'value_1', value: 41 }],
      activeSpotIds: [],
      min: -10,
      max: 100,
      step: 10,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    });
  });

  test('should emit validationErrors event when errors can not be fixed', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 40 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
    };
    const model = new Model(data);

    const modelListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, modelListener);

    const proposal: Partial<Proposal> = {
      spots: (data: Data) => [
        { id: 'value_0', value: 60 },
        { id: 'value_1', value: 30 },
      ],
    };

    model.propose(proposal);

    expect(modelListener).toBeCalledWith([errValueOrder()]);
  });
});

describe('Model.get', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipsFormatter,
    intervals: [false, true, false],
  };

  test('should return ModelData value by key', () => {
    const model = new Model(currentData);
    expect(model.get('spots')).toEqual([
      { id: 'value_0', value: 20 },
      { id: 'value_1', value: 40 },
    ]);
    expect(model.get('min')).toEqual(0);
    expect(model.get('max')).toEqual(100);
    expect(model.get('step')).toEqual(5);
    expect(model.get('orientation')).toEqual('horizontal');
    expect(model.get('tooltips')).toEqual([true, true]);
  });
});

describe('Model.set', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipsFormatter,
    intervals: [false, true, false],
  };

  test('should change ModelData value by key', () => {
    const model = new Model(currentData);
    const newSpots = [
      { id: 'value_0', value: 35 },
      { id: 'value_1', value: 45 },
    ];
    model.set('spots', newSpots);
    expect(model.get('spots')).toEqual(newSpots);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.set('step', 20);
    expect(updateListener).toBeCalledWith({
      spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 20,
      orientation: 'horizontal',
      tooltips: [true, true],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [false, true, false],
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
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipsFormatter,
    intervals: [false, true, false],
  };

  test('should return ModelData object', () => {
    const model = new Model(currentData);
    expect(model.getAll()).toEqual(currentData);
  });
});

describe('Model.setAll', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipsFormatter,
    intervals: [false, true, false],
  };

  test('should change ModelData', () => {
    const model = new Model(currentData);
    const newData: Data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false, true],
    };
    model.setAll(newData);
    expect(model.getAll()).toEqual(newData);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    const newData: Data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false, true],
    };
    model.setAll(newData);
    expect(updateListener).toBeCalledWith(newData);
  });

  test('should emit integrityError event', () => {
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, errorListener);
    const newData: Data = {
      spots: [{ id: 'value_0', value: 50 }, { id: 'value_1', value: 70 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 300,
      orientation: 'vertical',
      tooltips: [true, false],
      tooltipCollisions: [],
      tooltipsFormatter,
      intervals: [true, false, true],
    };
    model.setAll(newData);
    expect(errorListener).toBeCalledWith([errStepNotInRange()]);
  });
});
