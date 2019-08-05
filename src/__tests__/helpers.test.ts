import * as fc from 'fast-check';
import { range } from '../helpers';

describe('range', () => {
  test('Should return empty sequence if step == 0', () => {
    expect([...range(0, 10, 0)]).toEqual([]);
  });

  test('Should return empty sequence if start == step', () => {
    expect([...range(10, 10)]).toEqual([]);
  });

  test('Should return empty sequence if start < step & step < 0', () => {
    expect([...range(0, 10, -1)]).toEqual([]);
  });

  test('Should return empty sequence if start > step & step > 0', () => {
    expect([...range(10, 0, 1)]).toEqual([]);
  });

  test('Should return growing arithmetic progression when: start < stop && 0 < step < (stop - start) ', () => {
    fc.assert(
      fc.property(fc.integer(-1000, 1000), fc.integer(0, 100), fc.integer(1, 100), (start, total, step) => {
        const stop = start + total;
        const rangeArr = [...range(start, stop, step)];
        expect(rangeArr.length).toBe(Math.ceil(total / step));
        for (let i = 1; i < rangeArr.length; i += 1) {
          expect(rangeArr[i] - rangeArr[i - 1]).toBe(step);
        }
      }),
    );
  });

  test('Should return declining arithmetic progression when: start > stop && (stop - start) < step < 0', () => {
    fc.assert(
      fc.property(fc.integer(-1000, 1000), fc.integer(0, 100), fc.integer(-100, -1), (start, total, step) => {
        const stop = start - total;
        const rangeArr = [...range(start, stop, step)];
        expect(rangeArr.length).toBe(Math.ceil(total / -step));
        for (let i = 1; i < rangeArr.length; i += 1) {
          expect(rangeArr[i] - rangeArr[i - 1]).toBe(step);
        }
      }),
    );
  });
});
