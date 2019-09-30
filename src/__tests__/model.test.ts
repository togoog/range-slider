import { Right } from 'purify-ts/Either';
import {
  checkDataIntegrity,
  errValueNotInRange,
  errStepNotInRange,
  errMinIsGreaterThanMax,
} from '../mvp/model';

describe('Model.checkDataIntegrity', () => {
  test('should contain error MinIsGreaterThanMax if min > max', () => {
    const data: ModelData = {
      value: [30],
      min: 100,
      max: 0,
      step: 500,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([
        expect.objectContaining(errMinIsGreaterThanMax()),
      ]),
    );
  });

  test('should contain error ValueNotInRange if value < min', () => {
    const data: ModelData = {
      value: [-30],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain error ValueNotInRange if value > max', () => {
    const data: ModelData = {
      value: [300],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errValueNotInRange())]),
    );
  });

  test('should contain StepNotInRange if step > max - min', () => {
    const data: ModelData = {
      value: [30],
      min: 0,
      max: 100,
      step: 500,
      orientation: 'horizontal',
      tooltips: [true],
    };
    expect(checkDataIntegrity(data).extract()).toEqual(
      expect.arrayContaining([expect.objectContaining(errStepNotInRange())]),
    );
  });

  test('should return Right(data) if data integrity is valid', () => {
    const data: ModelData = {
      value: [30, 60],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: [true, true],
    };
    expect(checkDataIntegrity(data)).toEqual(Right(data));
  });
});
