import { Data, Proposal } from '../types';
import { Right } from 'purify-ts/Either';
import { not, multiply, add, subtract } from 'ramda';
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
      value: [30],
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
      value: [-30],
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
      value: [300],
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
      value: [30],
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
      value: [30],
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
      value: [30, 60],
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
      value: [30, 60],
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
    value: [20, 40],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should change value if value transformer is present', () => {
    const proposal: Partial<Proposal> = {
      value: (data: Data) => data.value.map(multiply(2)),
    };
    const model = new Model(currentData);
    expect(model.get('value')).toEqual([20, 40]);
    model.propose(proposal);
    expect(model.get('value')).toEqual([40, 80]);
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
      value: (data: Data) => data.value.map(add(1)),
      min: (data: Data) => subtract(data.min, 10),
      step: (data: Data) => multiply(data.step, 2),
    };
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.propose(proposal);
    expect(updateListener).toHaveBeenCalledWith({
      value: [21, 41],
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
      value: (data: Data) => data.value.map(multiply(3)),
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
    value: [20, 40],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should return value from ModelData by key', () => {
    const model = new Model(currentData);
    expect(model.get('value')).toEqual([20, 40]);
    expect(model.get('min')).toEqual(0);
    expect(model.get('max')).toEqual(100);
    expect(model.get('step')).toEqual(5);
    expect(model.get('orientation')).toEqual('horizontal');
    expect(model.get('tooltips')).toEqual([true, true]);
  });
});

describe('Model.set', () => {
  const currentData: Data = {
    value: [20, 40],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    tooltips: [true, true],
  };

  test('should change ModelData by key', () => {
    const model = new Model(currentData);
    model.set('value', [35, 45]);
    expect(model.get('value')).toEqual([35, 45]);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.set('step', 20);
    expect(updateListener).toBeCalledWith({
      value: [20, 40],
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
