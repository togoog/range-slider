import * as fc from 'fast-check';
import {
  //errors
  errRSONotValidValue,
  errRSONotValidMin,
  errRSONotValidMax,
  errRSONotValidStep,
  errRSONotValidOrientation,
  errRSONotValidTooltips,
  errRSOIncorrectShape,
  // validators
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkTooltips,
  checkRangeSliderOptions,
} from '../validators';
import { Right, Left } from 'purify-ts/Either';

describe('checkValue', () => {
  test('numbers are valid', () => {
    expect(checkValue(0)).toEqual(Right(0));
    expect(checkValue(-10)).toEqual(Right(-10));
    expect(checkValue(10)).toEqual(Right(10));
    expect(checkValue(3.1415)).toEqual(Right(3.1415));
  });

  test('pair of numbers is valid', () => {
    expect(checkValue([0, 0])).toEqual(Right([0, 0]));
    expect(checkValue([-10, -50])).toEqual(Right([-10, -50]));
    expect(checkValue([10, 50])).toEqual(Right([10, 50]));
    expect(checkValue([3.1415, 100])).toEqual(Right([3.1415, 100]));
  });

  test('non numeric value is not valid', () => {
    expect(checkValue('foo')).toEqual(Left(errRSONotValidValue('foo')));
    expect(checkValue(true)).toEqual(Left(errRSONotValidValue(true)));
    expect(checkValue(false)).toEqual(Left(errRSONotValidValue(false)));
    expect(checkValue(null)).toEqual(Left(errRSONotValidValue(null)));
    expect(checkValue(undefined)).toEqual(Left(errRSONotValidValue(undefined)));
    expect(checkValue(NaN)).toEqual(Left(errRSONotValidValue(NaN)));
    expect(checkValue({ foo: 123 })).toEqual(
      Left(errRSONotValidValue({ foo: 123 })),
    );
  });

  test('non numeric pair is not valid', () => {
    expect(checkValue(['foo', 'bar'])).toEqual(
      Left(errRSONotValidValue(['foo', 'bar'])),
    );
    expect(checkValue([null, undefined])).toEqual(
      Left(errRSONotValidValue([null, undefined])),
    );
    expect(checkValue([true, false])).toEqual(
      Left(errRSONotValidValue([true, false])),
    );
    expect(checkValue([123, 'bar'])).toEqual(
      Left(errRSONotValidValue([123, 'bar'])),
    );
    expect(checkValue([NaN, 0])).toEqual(Left(errRSONotValidValue([NaN, 0])));
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkMin', () => {
  test('numbers are valid', () => {
    expect(checkMin(0)).toEqual(Right(0));
    expect(checkMin(-10)).toEqual(Right(-10));
    expect(checkMin(10)).toEqual(Right(10));
    expect(checkMin(3.1415)).toEqual(Right(3.1415));
  });

  test('non numeric values are not valid', () => {
    expect(checkMin('foo')).toEqual(Left(errRSONotValidMin('foo')));
    expect(checkMin(true)).toEqual(Left(errRSONotValidMin(true)));
    expect(checkMin(false)).toEqual(Left(errRSONotValidMin(false)));
    expect(checkMin(null)).toEqual(Left(errRSONotValidMin(null)));
    expect(checkMin(undefined)).toEqual(Left(errRSONotValidMin(undefined)));
    expect(checkMin(NaN)).toEqual(Left(errRSONotValidMin(NaN)));
    expect(checkMin({ foo: 123 })).toEqual(
      Left(errRSONotValidMin({ foo: 123 })),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkMax', () => {
  test('numbers are valid', () => {
    expect(checkMax(0)).toEqual(Right(0));
    expect(checkMax(-10)).toEqual(Right(-10));
    expect(checkMax(10)).toEqual(Right(10));
    expect(checkMax(3.1415)).toEqual(Right(3.1415));
  });

  test('non numeric values are not valid', () => {
    expect(checkMax('foo')).toEqual(Left(errRSONotValidMax('foo')));
    expect(checkMax(true)).toEqual(Left(errRSONotValidMax(true)));
    expect(checkMax(false)).toEqual(Left(errRSONotValidMax(false)));
    expect(checkMax(null)).toEqual(Left(errRSONotValidMax(null)));
    expect(checkMax(undefined)).toEqual(Left(errRSONotValidMax(undefined)));
    expect(checkMax(NaN)).toEqual(Left(errRSONotValidMax(NaN)));
    expect(checkMax({ foo: 123 })).toEqual(
      Left(errRSONotValidMax({ foo: 123 })),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkStep', () => {
  test('numbers are valid', () => {
    expect(checkStep(0)).toEqual(Right(0));
    expect(checkStep(-10)).toEqual(Right(-10));
    expect(checkStep(10)).toEqual(Right(10));
    expect(checkStep(3.1415)).toEqual(Right(3.1415));
  });

  test('non numeric values are not valid', () => {
    expect(checkStep('foo')).toEqual(Left(errRSONotValidStep('foo')));
    expect(checkStep(true)).toEqual(Left(errRSONotValidStep(true)));
    expect(checkStep(false)).toEqual(Left(errRSONotValidStep(false)));
    expect(checkStep(null)).toEqual(Left(errRSONotValidStep(null)));
    expect(checkStep(undefined)).toEqual(Left(errRSONotValidStep(undefined)));
    expect(checkStep(NaN)).toEqual(Left(errRSONotValidStep(NaN)));
    expect(checkStep({ foo: 123 })).toEqual(
      Left(errRSONotValidStep({ foo: 123 })),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkOrientation', () => {
  test('only "horizontal" & "vertical" values are valid', () => {
    expect(checkOrientation('horizontal')).toEqual(Right('horizontal'));
    expect(checkOrientation('vertical')).toEqual(Right('vertical'));
    expect(checkOrientation('  vertical  ')).toEqual(
      Left(errRSONotValidOrientation('  vertical  ')),
    );
    expect(checkOrientation('foo')).toEqual(
      Left(errRSONotValidOrientation('foo')),
    );
    expect(checkOrientation(123)).toEqual(Left(errRSONotValidOrientation(123)));
    expect(checkOrientation(NaN)).toEqual(Left(errRSONotValidOrientation(NaN)));
    expect(checkOrientation(null)).toEqual(
      Left(errRSONotValidOrientation(null)),
    );
    expect(checkOrientation(undefined)).toEqual(
      Left(errRSONotValidOrientation(undefined)),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkTooltips', () => {
  test('booleans are valid', () => {
    expect(checkTooltips(true)).toEqual(Right(true));
    expect(checkTooltips(false)).toEqual(Right(false));
  });

  test('pair of booleans are valid', () => {
    expect(checkTooltips([true, true])).toEqual(Right([true, true]));
    expect(checkTooltips([true, false])).toEqual(Right([true, false]));
    expect(checkTooltips([false, true])).toEqual(Right([false, true]));
    expect(checkTooltips([false, false])).toEqual(Right([false, false]));
  });

  test('non boolean values are not valid', () => {
    expect(checkTooltips('foo')).toEqual(Left(errRSONotValidTooltips('foo')));
    expect(checkTooltips(null)).toEqual(Left(errRSONotValidTooltips(null)));
    expect(checkTooltips(undefined)).toEqual(
      Left(errRSONotValidTooltips(undefined)),
    );
    expect(checkTooltips(123)).toEqual(Left(errRSONotValidTooltips(123)));
    expect(checkTooltips({ foo: true })).toEqual(
      Left(errRSONotValidTooltips({ foo: true })),
    );
  });

  test('any pair of non boolean values is not valid', () => {
    expect(checkTooltips(['abc', true])).toEqual(
      Left(errRSONotValidTooltips(['abc', true])),
    );
    expect(checkTooltips([true, 123])).toEqual(
      Left(errRSONotValidTooltips([true, 123])),
    );
    expect(checkTooltips(['foo', null])).toEqual(
      Left(errRSONotValidTooltips(['foo', null])),
    );
    expect(checkTooltips([undefined, []])).toEqual(
      Left(errRSONotValidTooltips([undefined, []])),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkRangeSliderOptions', () => {
  test('should return Left(Error) for primitive values', () => {
    expect(checkRangeSliderOptions('foo')).toEqual(
      Left([errRSOIncorrectShape('foo')]),
    );
    expect(checkRangeSliderOptions(null)).toEqual(
      Left([errRSOIncorrectShape(null)]),
    );
    expect(checkRangeSliderOptions(undefined)).toEqual(
      Left([errRSOIncorrectShape(undefined)]),
    );
  });

  test('should return Right(value) for valid RangeSliderOptions', () => {
    fc.property(
      fc.record({
        value: fc.integer(),
        min: fc.integer(),
        max: fc.integer(),
        step: fc.integer(),
        orientation: fc.constantFrom(['horizontal', 'vertical']),
        tooltips: fc.array(fc.boolean()),
      }),
      v => {
        expect(checkRangeSliderOptions(v)).toEqual(Right(v));
      },
    );
  });

  test('should return Left([Error]) if value is not valid', () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([errRSONotValidValue('foo')]),
    );
  });

  test('should return Left([Error, Error]) if value, min are not valid', () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([errRSONotValidValue('foo'), errRSONotValidMin('bar')]),
    );
  });

  test('should return Left([Error, Error, Error]) if value, min, max are not valid', () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errRSONotValidValue('foo'),
        errRSONotValidMin('bar'),
        errRSONotValidMax('zoo'),
      ]),
    );
  });

  test('should return Left([Error, Error, Error, Error]) if value, min, max, step are not valid', () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errRSONotValidValue('foo'),
        errRSONotValidMin('bar'),
        errRSONotValidMax('zoo'),
        errRSONotValidStep('no-way'),
      ]),
    );
  });

  test(`should return Left([Error, Error, Error, Error, Error]) 
    if value, min, max, step, orientation are not valid`, () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'lesbian',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errRSONotValidValue('foo'),
        errRSONotValidMin('bar'),
        errRSONotValidMax('zoo'),
        errRSONotValidStep('no-way'),
        errRSONotValidOrientation('lesbian'),
      ]),
    );
  });

  test(`should return Left([Error, Error, Error, Error, Error, Error]) 
    if value, min, max, step, orientation, tooltips are not valid`, () => {
    const options: { [key in keyof RangeSliderOptions]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'lesbian',
      tooltips: null,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errRSONotValidValue('foo'),
        errRSONotValidMin('bar'),
        errRSONotValidMax('zoo'),
        errRSONotValidStep('no-way'),
        errRSONotValidOrientation('lesbian'),
        errRSONotValidTooltips(null),
      ]),
    );
  });
});
