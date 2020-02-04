import * as fc from 'fast-check';
import { keys, assocPath, pick } from 'ramda';

import { Data, RangeSliderError } from '../../types';
import {
  Model,
  // errors
  errValuesNotInRange,
  errStepNotInRange,
  errMinMax,
  errTooltipsCount,
  errIntervalsCount,
} from '../../mvp/model';
import { makeData } from '../arbitraries';

describe('Model.validate', () => {
  test(`if min > max, then validation result should contain ${errMinMax.name}`, () => {
    fc.assert(
      fc.property(makeData(), fc.nat(100), (data, seed) => {
        expect(
          Model.validate(assocPath(['min'], data.max + seed, data)).extract(),
        ).toContainEqual(errMinMax());

        expect(
          Model.validate(assocPath(['max'], data.min - seed, data)).extract(),
        ).toContainEqual(errMinMax());
      }),
    );
  });

  test(`if some value is > max or < min, 
    then validation result should contain ${errValuesNotInRange.name}`, () => {
    fc.assert(
      fc.property(makeData(), data => {
        expect(
          Model.validate(
            assocPath(['handleDict', 'handle_0', 'value'], data.min - 1, data),
          ).extract(),
        ).toContainEqual(errValuesNotInRange());

        expect(
          Model.validate(
            assocPath(['handleDict', 'handle_0', 'value'], data.max + 1, data),
          ).extract(),
        ).toContainEqual(errValuesNotInRange());
      }),
    );
  });

  test(`if step < 0 or step > max - min, 
    then validation result should contain ${errStepNotInRange.name}`, () => {
    fc.assert(
      fc.property(makeData(), data => {
        expect(
          Model.validate(assocPath(['step'], -1, data)).extract(),
        ).toContainEqual(errStepNotInRange());

        expect(
          Model.validate(
            assocPath(['step'], data.max - data.min + 1, data),
          ).extract(),
        ).toContainEqual(errStepNotInRange());
      }),
    );
  });

  test(`if tooltips.length !== value.length, 
    then validation result should contain ${errTooltipsCount.name}`, () => {
    fc.assert(
      fc.property(makeData(), data => {
        expect(
          Model.validate(
            assocPath(
              ['tooltipIds'],
              [...data.tooltipIds, 'redundant_tooltip'],
              data,
            ),
          ).extract(),
        ).toContainEqual(errTooltipsCount());

        expect(
          Model.validate(
            assocPath(['tooltipIds'], data.tooltipIds.slice(1), data),
          ).extract(),
        ).toContainEqual(errTooltipsCount());
      }),
    );
  });

  test(`if intervals.length !== value.length + 1,
    then validation result should contain ${errIntervalsCount.name}`, () => {
    fc.assert(
      fc.property(makeData(), data => {
        expect(
          Model.validate(
            assocPath(
              ['intervalIds'],
              [...data.intervalIds, 'redundant_interval'],
              data,
            ),
          ).extract(),
        ).toContainEqual(errIntervalsCount());

        expect(
          Model.validate(
            assocPath(['intervalIds'], data.intervalIds.slice(1), data),
          ).extract(),
        ).toContainEqual(errIntervalsCount());
      }),
    );
  });

  test(`valid Data validation should return Data itself`, () => {
    fc.assert(
      fc.property(makeData(), data => {
        expect(Model.validate(data).extract()).toEqual(data);
      }),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

test('Model.propose', () => {
  fc.assert(
    fc.property(makeData(), data => {
      const model = new Model(data);
      const updateListener = jest.fn();
      const errorListener = jest.fn();

      model.on(Model.EVENT_UPDATE, updateListener);
      model.on(Model.EVENT_ERRORS, errorListener);

      model.propose({
        min: data => data.min + 1,
        max: data => data.max + 1,
        step: data => data.step + 1,
        handleDict: data =>
          assocPath(['handle_0', 'value'], data.min + 1, data.handleDict),
        tooltipDict: data =>
          assocPath(['tooltip_0', 'isVisible'], false, data.tooltipDict),
        intervalDict: data =>
          assocPath(['interval_0', 'isVisible'], true, data.intervalDict),
      });

      if (errorListener.mock.calls.length === 0) {
        const updatedData: Data = updateListener.mock.calls[0][0];
        expect(updatedData.min).toBe(data.min + 1);
        expect(updatedData.max).toBe(data.max + 1);
        expect(updatedData.step).toBe(data.step + 1);
        expect(updatedData.handleDict.handle_0.value).toBe(data.min + 1);
        expect(updatedData.tooltipDict.tooltip_0.isVisible).toBe(false);
        expect(updatedData.intervalDict.interval_0.isVisible).toBe(true);
      } else {
        const errors: RangeSliderError[] = errorListener.mock.calls[0][0];
        expect(errors.length).toBeGreaterThan(0);
      }
    }),
  );
});

// ────────────────────────────────────────────────────────────────────────────────

test('Model.get', () => {
  fc.assert(
    fc.property(makeData(), data => {
      const model = new Model(data);

      keys(data).forEach(key => {
        expect(model.get(key)).toEqual(data[key]);
      });
    }),
  );
});

// ────────────────────────────────────────────────────────────────────────────────

test('Model.pick', () => {
  const allProps: (keyof Data)[] = [
    'min',
    'max',
    'step',
    'orientation',
    'cssClass',
    'handleDict',
    'handleIds',
    'activeHandleIds',
    'tooltipDict',
    'tooltipIds',
    'tooltipCollisions',
    'tooltipFormat',
    'intervalDict',
    'intervalIds',
    'grid',
    'gridFormat',
  ];

  fc.assert(
    fc.property(makeData(), fc.subarray(allProps), (data, someProps) => {
      const model = new Model(data);

      expect(model.pick(someProps)).toEqual(pick(someProps, data));
    }),
  );
});

// ────────────────────────────────────────────────────────────────────────────────

test('Model.set', () => {
  fc.assert(
    fc.property(makeData(), data => {
      const model = new Model(data);
      const updateListener = jest.fn();
      const errorListener = jest.fn();

      model.on(Model.EVENT_UPDATE, updateListener);
      model.on(Model.EVENT_ERRORS, errorListener);

      model.set({
        min: data.min + 1,
        max: data.max + 1,
        step: data.step + 1,
        handleDict: assocPath(
          ['handle_0', 'value'],
          data.min + 1,
          data.handleDict,
        ),
        tooltipDict: assocPath(
          ['tooltip_0', 'isVisible'],
          false,
          data.tooltipDict,
        ),
        intervalDict: assocPath(
          ['interval_0', 'isVisible'],
          true,
          data.intervalDict,
        ),
      });

      if (errorListener.mock.calls.length === 0) {
        const updatedData: Data = updateListener.mock.calls[0][0];
        expect(updatedData.min).toBe(data.min + 1);
        expect(updatedData.max).toBe(data.max + 1);
        expect(updatedData.step).toBe(data.step + 1);
        expect(updatedData.handleDict.handle_0.value).toBe(data.min + 1);
        expect(updatedData.tooltipDict.tooltip_0.isVisible).toBe(false);
        expect(updatedData.intervalDict.interval_0.isVisible).toBe(true);
      } else {
        const errors: RangeSliderError[] = errorListener.mock.calls[0][0];
        expect(errors.length).toBeGreaterThan(0);
      }
    }),
  );
});
