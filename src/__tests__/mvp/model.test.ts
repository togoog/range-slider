import { Right } from 'purify-ts/Either';
import { multiply, add, subtract, fromPairs, indexBy, prop, map } from 'ramda';
import { Data, Proposal } from '../../types';
import {
  Model,
  // errors
  errHandlesNotInRange,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
} from '../../mvp/model';
import * as defaults from '../../defaults';

describe('Model.checkDataIntegrity', () => {
  test('should contain errMinMax', () => {
    const data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
      },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 100,
      max: 0,
      step: 500,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: { id: 'tooltip_0', isVisible: true, handleId: 'handle_0' },
      },
      tooltipIds: ['tooltip_0'],
      tooltipFormatter: defaults.tooltipFormatter,
      tooltipCollisions: [],
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1'],
      grid: { isVisible: false, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errMinMax())]),
    );
  });

  test('should contain errValueNotInRange', () => {
    let data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: -30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
      },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: { id: 'tooltip_0', isVisible: true, handleId: 'handle_0' },
      },
      tooltipIds: ['tooltip_0'],
      tooltipFormatter: defaults.tooltipFormatter,
      tooltipCollisions: [],
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1'],
      grid: { isVisible: true, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errHandlesNotInRange())]),
    );

    data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 300,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
      },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
      },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1'],
      grid: { isVisible: false, numCells: [2, 3, 4] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errHandlesNotInRange())]),
    );
  });

  test('should contain errStepNotInRange', () => {
    let data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
      },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 200,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
      },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1'],
      grid: { isVisible: true, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );

    data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
      },
      handleIds: ['handle_0'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: -5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
      },
      tooltipIds: ['tooltip_0'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1'],
      grid: { isVisible: true, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );
  });

  test(`should contain errTooltipsCount`, () => {
    const data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 60,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: false, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errTooltipsCount())]),
    );
  });

  test(`should contain errIntervalsCount`, () => {
    const data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 60,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1', 'tooltip_2'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2', 'interval_3'],
      grid: { isVisible: true, numCells: [2, 3] },
    };
    expect(Model.validate(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errIntervalsCount())]),
    );
  });

  test('should return Right(data)', () => {
    const data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 30,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 60,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: true, numCells: [2, 3, 4] },
    };
    expect(Model.validate(data)).toEqual(Right(data));
  });
});

describe('Model.propose', () => {
  const currentData: Data = {
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: defaults.tooltipFormatter,
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: false, numCells: [2, 3, 4] },
  };

  test('should change spots', () => {
    const proposal: Partial<Proposal> = {
      handleDict: (data: Data) =>
        map(d => ({ ...d, value: d.value * 2 }), data.handleDict),
    };
    const model = new Model(currentData);
    expect(model.get('handleDict')).toEqual({
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    });
    model.propose(proposal);
    expect(model.get('handleDict')).toEqual({
      handle_0: {
        id: 'handle_0',
        value: 40,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 80,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    });
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
        data.orientation === 'horizontal' ? 'vertical' : 'horizontal',
    };
    const model = new Model(currentData);
    expect(model.get('orientation')).toEqual('horizontal');
    model.propose(proposal);
    expect(model.get('orientation')).toEqual('vertical');
  });

  test('should change tooltips', () => {
    const proposal: Partial<Proposal> = {
      tooltipDict: (data: Data) =>
        map(d => ({ ...d, isVisible: !d.isVisible }), data.tooltipDict),
    };
    const model = new Model(currentData);
    expect(model.get('tooltipDict')).toEqual({
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    });
    model.propose(proposal);
    expect(model.get('tooltipDict')).toEqual({
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: false,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: false,
        handleId: 'handle_1',
      },
    });
  });

  test('should emit update event', () => {
    const proposal: Partial<Proposal> = {
      handleDict: (data: Data) =>
        map(d => ({ ...d, value: d.value + 1 }), data.handleDict),
      min: (data: Data) => subtract(data.min, 10),
      step: (data: Data) => multiply(data.step, 2),
    };
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.propose(proposal);
    expect(updateListener).toHaveBeenCalledWith({
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 21,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 41,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: -10,
      max: 100,
      step: 10,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: false, numCells: [2, 3, 4] },
    } as Data);
  });

  test('should emit validationErrors event when errors can not be fixed', () => {
    const data: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 40,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 70,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: true, numCells: [2, 3] },
    };
    const model = new Model(data);

    const modelListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, modelListener);

    const proposal: Partial<Proposal> = {
      min: () => 200,
    };

    model.propose(proposal);

    expect(modelListener).toBeCalledWith([errMinMax()]);
  });
});

describe('Model.get', () => {
  const currentData: Data = {
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: defaults.tooltipFormatter,
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: true, numCells: [4, 5] },
  };

  test('should return ModelData value by key', () => {
    const model = new Model(currentData);
    expect(model.get('handleDict')).toEqual({
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    });
    expect(model.get('min')).toEqual(0);
    expect(model.get('max')).toEqual(100);
    expect(model.get('step')).toEqual(5);
    expect(model.get('orientation')).toEqual('horizontal');
    expect(model.get('tooltipDict')).toEqual({
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    });
    expect(model.get('grid')).toEqual({ isVisible: true, numCells: [4, 5] });
  });
});

describe('Model.set', () => {
  const currentData: Data = {
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: defaults.tooltipFormatter,
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: false, numCells: [3, 4] },
  };

  test('should change ModelData value by key', () => {
    const model = new Model(currentData);
    const newHandles = {
      handle_0: {
        id: 'handle_0',
        value: 35,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 45,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    };
    model.set('handleDict', newHandles);
    expect(model.get('handleDict')).toEqual(newHandles);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    model.set('step', 20);
    expect(updateListener).toBeCalledWith({
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 20,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 40,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 20,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: true,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: false,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: true,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: false,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: false, numCells: [3, 4] },
    } as Data);
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
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: defaults.tooltipFormatter,
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: true, numCells: [3, 4] },
  };

  test('should return ModelData object', () => {
    const model = new Model(currentData);
    expect(model.getAll()).toEqual(currentData);
  });
});

describe('Model.setAll', () => {
  const currentData: Data = {
    handleDict: {
      handle_0: {
        id: 'handle_0',
        value: 20,
        tooltipId: 'tooltip_0',
        lhsIntervalId: 'interval_0',
        rhsIntervalId: 'interval_1',
      },
      handle_1: {
        id: 'handle_1',
        value: 40,
        tooltipId: 'tooltip_1',
        lhsIntervalId: 'interval_1',
        rhsIntervalId: 'interval_2',
      },
    },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltipDict: {
      tooltip_0: {
        id: 'tooltip_0',
        isVisible: true,
        handleId: 'handle_0',
      },
      tooltip_1: {
        id: 'tooltip_1',
        isVisible: true,
        handleId: 'handle_1',
      },
    },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter: defaults.tooltipFormatter,
    intervalDict: {
      interval_0: {
        id: 'interval_0',
        isVisible: false,
        lhsHandleId: null,
        rhsHandleId: 'handle_0',
      },
      interval_1: {
        id: 'interval_1',
        isVisible: true,
        lhsHandleId: 'handle_0',
        rhsHandleId: 'handle_1',
      },
      interval_2: {
        id: 'interval_2',
        isVisible: false,
        lhsHandleId: 'handle_1',
        rhsHandleId: null,
      },
    },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: false, numCells: [3, 4] },
  };

  test('should change ModelData', () => {
    const model = new Model(currentData);
    const newData: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 50,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 70,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: false,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: true,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: true, numCells: [5, 6] },
    };
    model.setAll(newData);
    expect(model.getAll()).toEqual(newData);
  });

  test('should emit update event', () => {
    const model = new Model(currentData);
    const updateListener = jest.fn();
    model.on(Model.EVENT_UPDATE, updateListener);
    const newData: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 50,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 70,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 3,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: false,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: true,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: true, numCells: [2, 5] },
    };
    model.setAll(newData);
    expect(updateListener).toBeCalledWith(newData);
  });

  test('should emit integrityError event', () => {
    const model = new Model(currentData);
    const errorListener = jest.fn();
    model.on(Model.EVENT_VALIDATION_ERRORS, errorListener);
    const newData: Data = {
      handleDict: {
        handle_0: {
          id: 'handle_0',
          value: 50,
          tooltipId: 'tooltip_0',
          lhsIntervalId: 'interval_0',
          rhsIntervalId: 'interval_1',
        },
        handle_1: {
          id: 'handle_1',
          value: 70,
          tooltipId: 'tooltip_1',
          lhsIntervalId: 'interval_1',
          rhsIntervalId: 'interval_2',
        },
      },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 300,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltipDict: {
        tooltip_0: {
          id: 'tooltip_0',
          isVisible: true,
          handleId: 'handle_0',
        },
        tooltip_1: {
          id: 'tooltip_1',
          isVisible: false,
          handleId: 'handle_1',
        },
      },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter: defaults.tooltipFormatter,
      intervalDict: {
        interval_0: {
          id: 'interval_0',
          isVisible: true,
          lhsHandleId: null,
          rhsHandleId: 'handle_0',
        },
        interval_1: {
          id: 'interval_1',
          isVisible: false,
          lhsHandleId: 'handle_0',
          rhsHandleId: 'handle_1',
        },
        interval_2: {
          id: 'interval_2',
          isVisible: true,
          lhsHandleId: 'handle_1',
          rhsHandleId: null,
        },
      },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      grid: { isVisible: true, numCells: [5, 6] },
    };
    model.setAll(newData);
    expect(errorListener).toBeCalledWith([errStepNotInRange()]);
  });
});
