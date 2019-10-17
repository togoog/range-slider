import { Data, Proposal, Spot } from '../types';
import { Right } from 'purify-ts/Either';
import { not, multiply, add, subtract, evolve, identity } from 'ramda';
import {
  Model,
  // errors
  errValueNotInRange,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
} from '../mvp/model';

describe('Model.checkDataIntegrity', () => {
  test('should contain error MinIsGreaterThanMax if min > max', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }],
      min: 100,
      max: 0,
      step: 500,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errMinMax())]),
    );
  });

  test('should contain error ValueNotInRange if value < min', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: -30 }],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain error ValueNotInRange if value > max', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 300 }],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain StepNotInRange if step > max - min', () => {
    let data: Data = {
      spots: [{ id: 'value_0', value: 30 }],
      min: 0,
      max: 100,
      step: 200,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );

    data = {
      spots: [{ id: 'value_0', value: 30 }],
      min: 0,
      max: 100,
      step: -5,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );
  });

  test(`should contain error TooltipsDoNotMatchWithValues 
    if tooltips.length != 1 && tooltips.length != value.length`, () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }, { id: 'value_1', value: 60 }],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true, false],
    };
    expect(Model.checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errTooltipsCount())]),
    );
  });

  test('should return Right(data) if data integrity is valid', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 30 }, { id: 'value_1', value: 60 }],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true],
    };
    expect(Model.checkDataIntegrity(data)).toEqual(Right(data));
  });
});

describe('Model.propose', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should change value if value transformer is present', () => {
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

  test('should change min if min transformer is present', () => {
    const proposal: Partial<Proposal> = {
      min: (data: Data) => add(data.min, 1),
    };
    const model = new Model(currentData);
    expect(model.get('min')).toEqual(0);
    model.propose(proposal);
    expect(model.get('min')).toEqual(1);
  });

  test('should change max if max transformer is present', () => {
    const proposal: Partial<Proposal> = {
      max: (data: Data) => subtract(data.max, 1),
    };
    const model = new Model(currentData);
    expect(model.get('max')).toEqual(100);
    model.propose(proposal);
    expect(model.get('max')).toEqual(99);
  });

  test('should change step if step transformer is present', () => {
    const proposal: Partial<Proposal> = {
      step: (data: Data) => add(data.step, 5),
    };
    const model = new Model(currentData);
    expect(model.get('step')).toEqual(5);
    model.propose(proposal);
    expect(model.get('step')).toEqual(10);
  });

  test('should change orientation if orientation transformer is present', () => {
    const proposal: Partial<Proposal> = {
      orientation: (data: Data) =>
        data.orientation == 'horizontal' ? 'vertical' : 'horizontal',
    };
    const model = new Model(currentData);
    expect(model.get('orientation')).toEqual('horizontal');
    model.propose(proposal);
    expect(model.get('orientation')).toEqual('vertical');
  });

  test('should change tooltips if tooltips transformer is present', () => {
    const proposal: Partial<Proposal> = {
      tooltips: (data: Data) => data.tooltips.map(not),
    };
    const model = new Model(currentData);
    expect(model.get('tooltips')).toEqual([true, true]);
    model.propose(proposal);
    expect(model.get('tooltips')).toEqual([false, false]);
  });

  test('should emit update event with new ModelData object', () => {
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
      min: -10,
      max: 100,
      step: 10,
      orientation: 'horizontal',
      tooltips: [true, true],
    });
  });

  test(`should emit integrityError event with array of Error objects 
    if proposal brakes data integrity`, () => {
    const proposal: Partial<Proposal> = {
      spots: (data: Data) =>
        data.spots.map(
          evolve({
            id: identity,
            value: multiply(3),
          }),
        ) as Spot[],
      tooltips: data => [...data.tooltips, true],
    };
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_INTEGRITY_ERRORS, errorListener);
    model.propose(proposal);
    expect(errorListener).toHaveBeenCalledWith([
      errValueNotInRange(),
      errTooltipsCount(),
    ]);
  });
});

describe('Model.get', () => {
  const currentData: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should return value from ModelData by key', () => {
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
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should change ModelData by key', () => {
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
      min: 0,
      max: 100,
      step: 20,
      orientation: 'horizontal',
      tooltips: [true, true],
    });
  });

  test('should emit integrityError event if data change brakes integrity', () => {
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_INTEGRITY_ERRORS, errorListener);
    model.set('step', 200);
    expect(errorListener).toBeCalledWith([errStepNotInRange()]);
  });
});
