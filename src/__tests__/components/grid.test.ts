import { createCells } from '../../components/grid/grid';

describe('createCells', () => {
  test('should create 1 level of tick marks', () => {
    expect(createCells(0, 100, 'horizontal', 'grid-cell', [])).toEqual([]);
    expect(createCells(0, 100, 'horizontal', 'grid-cell', [0])).toEqual([]);
    expect(createCells(0, 100, 'horizontal', 'grid-cell', [1])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [3])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '33.33',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 33.33,
      },
      {
        label: '66.67',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 66.67,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);
  });

  test('should create 2 levels of tick marks', () => {
    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 0])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 1])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 2])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '25',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 25,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '75',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 75,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 3])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '16.67',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 16.67,
      },
      {
        label: '33.33',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 33.33,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '66.67',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 66.67,
      },
      {
        label: '83.33',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 83.33,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);
  });

  test('should create 3 levels of tick marks', () => {
    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 0, 0])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 1, 0])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 1, 1])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 1, 2])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '25',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 25,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '75',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 75,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);

    expect(createCells(0, 100, 'horizontal', 'grid-cell', [2, 2, 2])).toEqual([
      {
        label: '0',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 0,
      },
      {
        label: '12.5',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 12.5,
      },
      {
        label: '25',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 25,
      },
      {
        label: '37.5',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 37.5,
      },
      {
        label: '50',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 50,
      },
      {
        label: '62.5',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 62.5,
      },
      {
        label: '75',
        isVisibleLabel: false,
        level: 2,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 75,
      },
      {
        label: '87.5',
        isVisibleLabel: false,
        level: 3,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 87.5,
      },
      {
        label: '100',
        isVisibleLabel: true,
        level: 1,
        orientation: 'horizontal',
        cssClass: 'grid-cell',
        position: 100,
      },
    ]);
  });
});
