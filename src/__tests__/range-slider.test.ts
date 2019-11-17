import { Options } from '../types';
import { RangeSlider, createRangeSlider } from '../range-slider';
import * as defaults from '../defaults';

describe('RangeSlider.get', () => {
  test('should return Option value by key', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root') as HTMLElement;
    const options: Options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: true,
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [true, false],
      grid: false,
    };
    const rs = new RangeSlider($el, options);
    expect(rs.get('value')).toEqual([50]);
    expect(rs.get('min')).toEqual(0);
    expect(rs.get('max')).toEqual(100);
    expect(rs.get('step')).toEqual(1);
    expect(rs.get('orientation')).toEqual('horizontal');
    expect(rs.get('tooltips')).toEqual([true]);
    expect(rs.get('intervals')).toEqual([true, false]);
    expect(rs.get('cssClass')).toEqual('range-slider');
    expect(rs.get('tooltipFormatter')).toEqual(defaults.tooltipFormatter);
    expect(rs.get('grid')).toEqual({
      isVisible: false,
      numCells: defaults.gridNumCells,
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('RangeSlider.set', () => {
  test('should change Option value by key', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root') as HTMLElement;
    const options: Options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: true,
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [true, false],
      grid: false,
    };
    const rs = new RangeSlider($el, options);

    rs.set('value', 70);
    expect(rs.get('value')).toEqual([70]);

    rs.set('min', 7);
    expect(rs.get('min')).toEqual(7);

    rs.set('max', 300);
    expect(rs.get('max')).toEqual(300);

    rs.set('step', 3);
    expect(rs.get('step')).toEqual(3);

    rs.set('orientation', 'vertical');
    expect(rs.get('orientation')).toEqual('vertical');

    rs.set('cssClass', 'super-range-slider');
    expect(rs.get('cssClass')).toEqual('super-range-slider');

    rs.set('tooltips', false);
    expect(rs.get('tooltips')).toEqual([false]);

    const newFormatter = (value: number) => `value: ${value}`;
    rs.set('tooltipFormatter', newFormatter);
    expect(rs.get('tooltipFormatter')).toEqual(newFormatter);

    rs.set('intervals', false);
    expect(rs.get('intervals')).toEqual([false, false]);
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('RangeSlider.getAll', () => {
  test('should return Options object', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root') as HTMLElement;
    const options: Options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: true,
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [true, false],
      grid: { isVisible: true, numCells: [4, 5] },
    };
    const rs = new RangeSlider($el, options);
    expect(rs.getAll()).toEqual({
      value: [50],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: [true],
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [true, false],
      grid: { isVisible: true, numCells: [4, 5] },
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('RangeSlider.setAll', () => {
  test('should change all options', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root') as HTMLElement;
    const options: Options = {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      cssClass: 'range-slider',
      tooltips: true,
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [true, false],
      grid: false,
    };
    const rs = new RangeSlider($el, options);

    const newOptions: Options = {
      value: [70, 80],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltips: true,
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: false,
      grid: false,
    };

    rs.setAll(newOptions);

    expect(rs.getAll()).toEqual({
      value: [70, 80],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'vertical',
      cssClass: 'range-slider',
      tooltips: [true, true],
      tooltipFormatter: defaults.tooltipFormatter,
      intervals: [false, false, false],
      grid: { isVisible: false, numCells: defaults.gridNumCells },
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────────

describe('createRangeSlider', () => {
  test('should create RangeSliders from valid css selector', () => {
    document.body.innerHTML = '<div id="root"></div>';
    let rsList = createRangeSlider('#root');
    expect(rsList).toHaveLength(1);

    document.body.innerHTML =
      '<div class="rs"></div> <div class="rs"></div> <div class="rs"></div>';
    rsList = createRangeSlider('.rs');
    expect(rsList).toHaveLength(3);
  });

  test('should create RangeSliders from HTMLCollectionOf<HTMLElement>', () => {
    document.body.innerHTML =
      '<div class="rs"></div> <div class="rs"></div> <div class="rs"></div>';
    const elements = document.getElementsByClassName('rs');
    const rsList = createRangeSlider(Array.from(elements) as HTMLElement[]);
    expect(rsList).toHaveLength(3);
  });

  test('should create RangeSlider from HTMLElement', () => {
    document.body.innerHTML = '<div class="rs"></div>';
    const element = document.getElementsByClassName('rs')[0];
    const rsList = createRangeSlider(element as HTMLElement);
    expect(rsList).toHaveLength(1);
  });
});
