import * as fc from 'fast-check';
import { checkValue } from '../validators';

describe('checkValue', () => {
  test('should return true for any number', () => {
    fc.assert(
      fc.property(fc.integer(), v => {
        expect(checkValue(v)).toBe(true);
      })
    );
  });

  test('should return true for any non empty array of numbers', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), 1, 100), v => {
        expect(checkValue(v)).toBe(true);
      })
    );
  });

  test('should return false for any non numeric value', () => {
    // for strings
    fc.assert(
      fc.property(fc.unicode(), v => {
        expect(checkValue(v)).toBe(false);
      })
    );

    // for booleans
    expect(checkValue(true)).toBe(false);
    expect(checkValue(false)).toBe(false);

    // for null & undefined
    expect(checkValue(null)).toBe(false);
    expect(checkValue(undefined)).toBe(false);

    // for objects
    fc.assert(
      fc.property(fc.object(), v => {
        expect(checkValue(v)).toBe(false);
      })
    );
  });

  test('should return false for any array with non numeric values', () => {
    // array of strings
    fc.assert(
      fc.property(fc.array(fc.unicode()), v => {
        expect(checkValue(v)).toBe(false);
      })
    );

    // array of booleans
    fc.assert(
      fc.property(fc.array(fc.boolean()), v => {
        expect(checkValue(v)).toBe(false);
      })
    );

    // array of null
    fc.assert(
      fc.property(fc.array(fc.constant(null)), v => {
        expect(checkValue(v)).toBe(false);
      })
    );

    // array of undefined
    fc.assert(
      fc.property(fc.array(fc.constant(undefined)), v => {
        expect(checkValue(v)).toBe(false);
      })
    );

    // array of objects
    fc.assert(
      fc.property(fc.array(fc.object()), v => {
        expect(checkValue(v)).toBe(false);
      })
    );
  });
});