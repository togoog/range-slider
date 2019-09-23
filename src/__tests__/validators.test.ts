import * as fc from 'fast-check';
import { checkValue, checkMin, checkMax } from '../validators';

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

function anyNumberIsOk(fn: Function): void {
  fc.assert(
    fc.property(fc.integer(), v => {
      expect(fn(v)).toBe(true);
    })
  );
}

function anyNonNumberIsBad(fn: Function): void {
  // for strings
  fc.assert(
    fc.property(fc.unicode(), v => {
      expect(fn(v)).toBe(false);
    })
  );

  // for booleans
  expect(fn(true)).toBe(false);
  expect(fn(false)).toBe(false);

  // for null & undefined
  expect(fn(null)).toBe(false);
  expect(fn(undefined)).toBe(false);

  // for objects
  fc.assert(
    fc.property(fc.object(), v => {
      expect(fn(v)).toBe(false);
    })
  );
}

function anyNonEmptyArrayOfNumbersIsOk(fn: Function): void {
  fc.assert(
    fc.property(fc.array(fc.integer(), 1, 100), v => {
      expect(fn(v)).toBe(true);
    })
  );
}

function anyNonNumericArrayIsBad(fn: Function): void {
  // array of strings
  fc.assert(
    fc.property(fc.array(fc.unicode()), v => {
      expect(fn(v)).toBe(false);
    })
  );

  // array of booleans
  fc.assert(
    fc.property(fc.array(fc.boolean()), v => {
      expect(fn(v)).toBe(false);
    })
  );

  // array of null
  fc.assert(
    fc.property(fc.array(fc.constant(null)), v => {
      expect(fn(v)).toBe(false);
    })
  );

  // array of undefined
  fc.assert(
    fc.property(fc.array(fc.constant(undefined)), v => {
      expect(fn(v)).toBe(false);
    })
  );

  // array of objects
  fc.assert(
    fc.property(fc.array(fc.object()), v => {
      expect(fn(v)).toBe(false);
    })
  );
}

//
// ─── TESTS ──────────────────────────────────────────────────────────────────────
//

describe('checkValue', () => {
  test('should return true for any number', () => {
    anyNumberIsOk(checkValue);
  });

  test('should return true for any non empty array of numbers', () => {
    anyNonEmptyArrayOfNumbersIsOk(checkValue);
  });

  test('should return false for any non numeric value', () => {
    anyNonNumberIsBad(checkValue);
  });

  test('should return false for any array with non numeric values', () => {
    anyNonNumericArrayIsBad(checkValue);
  });
});

describe('checkMin', () => {
  test('should return true for any number', () => {
    anyNumberIsOk(checkMin);
  });

  test('should return false for any non numeric value', () => {
    anyNonNumberIsBad(checkMin);
  });
});

describe('checkMax', () => {
  test('should return true for any number', () => {
    anyNumberIsOk(checkMax);
  });

  test('should return false for any non numeric value', () => {
    anyNonNumberIsBad(checkMax);
  });
});