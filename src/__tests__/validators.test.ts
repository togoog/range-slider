import { Options } from '../types';
import * as fc from 'fast-check';
import {
  //errors
  errNotValidValue,
  errNotValidMin,
  errNotValidMax,
  errNotValidStep,
  errNotValidOrientation,
  errNotValidTooltips,
  errIncorrectShape,
  // validators
  checkValue,
  checkMin,
  checkMax,
  checkStep,
  checkOrientation,
  checkTooltips,
  checkRangeSliderOptions,
} from '../validators';
import { Just, Nothing } from 'purify-ts/Maybe';
import { Left, Right } from 'purify-ts/Either';

describe('checkValue', () => {
  test('numbers are valid', () => {
    expect(checkValue(0)).toEqual(Nothing);
    expect(checkValue(-10)).toEqual(Nothing);
    expect(checkValue(10)).toEqual(Nothing);
    expect(checkValue(3.1415)).toEqual(Nothing);
  });

  test('pair of numbers is valid', () => {
    expect(checkValue([0, 0])).toEqual(Nothing);
    expect(checkValue([-10, -50])).toEqual(Nothing);
    expect(checkValue([10, 50])).toEqual(Nothing);
    expect(checkValue([3.1415, 100])).toEqual(Nothing);
  });

  test('non numeric value is not valid', () => {
    expect(checkValue('foo')).toEqual(Just(errNotValidValue('foo')));
    expect(checkValue(true)).toEqual(Just(errNotValidValue(true)));
    expect(checkValue(false)).toEqual(Just(errNotValidValue(false)));
    expect(checkValue(null)).toEqual(Just(errNotValidValue(null)));
    expect(checkValue(undefined)).toEqual(Just(errNotValidValue(undefined)));
    expect(checkValue(NaN)).toEqual(Just(errNotValidValue(NaN)));
    expect(checkValue({ foo: 123 })).toEqual(
      Just(errNotValidValue({ foo: 123 })),
    );
  });

  test('non numeric pair is not valid', () => {
    expect(checkValue(['foo', 'bar'])).toEqual(
      Just(errNotValidValue(['foo', 'bar'])),
    );
    expect(checkValue([null, undefined])).toEqual(
      Just(errNotValidValue([null, undefined])),
    );
    expect(checkValue([true, false])).toEqual(
      Just(errNotValidValue([true, false])),
    );
    expect(checkValue([123, 'bar'])).toEqual(
      Just(errNotValidValue([123, 'bar'])),
    );
    expect(checkValue([NaN, 0])).toEqual(Just(errNotValidValue([NaN, 0])));
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkMin', () => {
  test('numbers are valid', () => {
    expect(checkMin(0)).toEqual(Nothing);
    expect(checkMin(-10)).toEqual(Nothing);
    expect(checkMin(10)).toEqual(Nothing);
    expect(checkMin(3.1415)).toEqual(Nothing);
  });

  test('non numeric values are not valid', () => {
    expect(checkMin('foo')).toEqual(Just(errNotValidMin('foo')));
    expect(checkMin(true)).toEqual(Just(errNotValidMin(true)));
    expect(checkMin(false)).toEqual(Just(errNotValidMin(false)));
    expect(checkMin(null)).toEqual(Just(errNotValidMin(null)));
    expect(checkMin(undefined)).toEqual(Just(errNotValidMin(undefined)));
    expect(checkMin(NaN)).toEqual(Just(errNotValidMin(NaN)));
    expect(checkMin({ foo: 123 })).toEqual(Just(errNotValidMin({ foo: 123 })));
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkMax', () => {
  test('numbers are valid', () => {
    expect(checkMax(0)).toEqual(Nothing);
    expect(checkMax(-10)).toEqual(Nothing);
    expect(checkMax(10)).toEqual(Nothing);
    expect(checkMax(3.1415)).toEqual(Nothing);
  });

  test('non numeric values are not valid', () => {
    expect(checkMax('foo')).toEqual(Just(errNotValidMax('foo')));
    expect(checkMax(true)).toEqual(Just(errNotValidMax(true)));
    expect(checkMax(false)).toEqual(Just(errNotValidMax(false)));
    expect(checkMax(null)).toEqual(Just(errNotValidMax(null)));
    expect(checkMax(undefined)).toEqual(Just(errNotValidMax(undefined)));
    expect(checkMax(NaN)).toEqual(Just(errNotValidMax(NaN)));
    expect(checkMax({ foo: 123 })).toEqual(Just(errNotValidMax({ foo: 123 })));
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkStep', () => {
  test('numbers are valid', () => {
    expect(checkStep(0)).toEqual(Nothing);
    expect(checkStep(-10)).toEqual(Nothing);
    expect(checkStep(10)).toEqual(Nothing);
    expect(checkStep(3.1415)).toEqual(Nothing);
  });

  test('non numeric values are not valid', () => {
    expect(checkStep('foo')).toEqual(Just(errNotValidStep('foo')));
    expect(checkStep(true)).toEqual(Just(errNotValidStep(true)));
    expect(checkStep(false)).toEqual(Just(errNotValidStep(false)));
    expect(checkStep(null)).toEqual(Just(errNotValidStep(null)));
    expect(checkStep(undefined)).toEqual(Just(errNotValidStep(undefined)));
    expect(checkStep(NaN)).toEqual(Just(errNotValidStep(NaN)));
    expect(checkStep({ foo: 123 })).toEqual(
      Just(errNotValidStep({ foo: 123 })),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkOrientation', () => {
  test('only "horizontal" & "vertical" values are valid', () => {
    expect(checkOrientation('horizontal')).toEqual(Nothing);
    expect(checkOrientation('vertical')).toEqual(Nothing);
    expect(checkOrientation('  vertical  ')).toEqual(
      Just(errNotValidOrientation('  vertical  ')),
    );
    expect(checkOrientation('foo')).toEqual(
      Just(errNotValidOrientation('foo')),
    );
    expect(checkOrientation(123)).toEqual(Just(errNotValidOrientation(123)));
    expect(checkOrientation(NaN)).toEqual(Just(errNotValidOrientation(NaN)));
    expect(checkOrientation(null)).toEqual(Just(errNotValidOrientation(null)));
    expect(checkOrientation(undefined)).toEqual(
      Just(errNotValidOrientation(undefined)),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkTooltips', () => {
  test('booleans are valid', () => {
    expect(checkTooltips(true)).toEqual(Nothing);
    expect(checkTooltips(false)).toEqual(Nothing);
  });

  test('pair of booleans are valid', () => {
    expect(checkTooltips([true, true])).toEqual(Nothing);
    expect(checkTooltips([true, false])).toEqual(Nothing);
    expect(checkTooltips([false, true])).toEqual(Nothing);
    expect(checkTooltips([false, false])).toEqual(Nothing);
  });

  test('non boolean values are not valid', () => {
    expect(checkTooltips('foo')).toEqual(Just(errNotValidTooltips('foo')));
    expect(checkTooltips(null)).toEqual(Just(errNotValidTooltips(null)));
    expect(checkTooltips(undefined)).toEqual(
      Just(errNotValidTooltips(undefined)),
    );
    expect(checkTooltips(123)).toEqual(Just(errNotValidTooltips(123)));
    expect(checkTooltips({ foo: true })).toEqual(
      Just(errNotValidTooltips({ foo: true })),
    );
  });

  test('any pair of non boolean values is not valid', () => {
    expect(checkTooltips(['abc', true])).toEqual(
      Just(errNotValidTooltips(['abc', true])),
    );
    expect(checkTooltips([true, 123])).toEqual(
      Just(errNotValidTooltips([true, 123])),
    );
    expect(checkTooltips(['foo', null])).toEqual(
      Just(errNotValidTooltips(['foo', null])),
    );
    expect(checkTooltips([undefined, []])).toEqual(
      Just(errNotValidTooltips([undefined, []])),
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('checkRangeSliderOptions', () => {
  test('should return Left(Error) for primitive values', () => {
    expect(checkRangeSliderOptions('foo')).toEqual(
      Left([errIncorrectShape('foo')]),
    );
    expect(checkRangeSliderOptions(null)).toEqual(
      Left([errIncorrectShape(null)]),
    );
    expect(checkRangeSliderOptions(undefined)).toEqual(
      Left([errIncorrectShape(undefined)]),
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
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 0,
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([errNotValidValue('foo')]),
    );
  });

  test('should return Left([Error, Error]) if value, min are not valid', () => {
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 100,
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([errNotValidValue('foo'), errNotValidMin('bar')]),
    );
  });

  test('should return Left([Error, Error, Error]) if value, min, max are not valid', () => {
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 5,
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errNotValidValue('foo'),
        errNotValidMin('bar'),
        errNotValidMax('zoo'),
      ]),
    );
  });

  test('should return Left([Error, Error, Error, Error]) if value, min, max, step are not valid', () => {
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'horizontal',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errNotValidValue('foo'),
        errNotValidMin('bar'),
        errNotValidMax('zoo'),
        errNotValidStep('no-way'),
      ]),
    );
  });

  test(`should return Left([Error, Error, Error, Error, Error]) 
    if value, min, max, step, orientation are not valid`, () => {
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'lesbian',
      tooltips: true,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errNotValidValue('foo'),
        errNotValidMin('bar'),
        errNotValidMax('zoo'),
        errNotValidStep('no-way'),
        errNotValidOrientation('lesbian'),
      ]),
    );
  });

  test(`should return Left([Error, Error, Error, Error, Error, Error]) 
    if value, min, max, step, orientation, tooltips are not valid`, () => {
    const options: { [key in keyof Options]: unknown } = {
      value: 'foo',
      min: 'bar',
      max: 'zoo',
      step: 'no-way',
      orientation: 'lesbian',
      tooltips: null,
    };

    expect(checkRangeSliderOptions(options)).toEqual(
      Left([
        errNotValidValue('foo'),
        errNotValidMin('bar'),
        errNotValidMax('zoo'),
        errNotValidStep('no-way'),
        errNotValidOrientation('lesbian'),
        errNotValidTooltips(null),
      ]),
    );
  });
});
