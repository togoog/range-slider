import { Options } from '../types';
import { RangeSlider, createRangeSlider } from '../range-slider';

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
      tooltips: true,
      intervals: [true, false],
    };
    const rs = new RangeSlider($el, options);
    expect(rs.get('value')).toEqual([50]);
    expect(rs.get('min')).toEqual(0);
    expect(rs.get('max')).toEqual(100);
    expect(rs.get('step')).toEqual(1);
    expect(rs.get('orientation')).toEqual('horizontal');
    expect(rs.get('tooltips')).toEqual([true]);
    expect(rs.get('intervals')).toEqual([true, false]);
  });
});

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
      tooltips: true,
      intervals: [true, false],
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

    rs.set('tooltips', false);
    expect(rs.get('tooltips')).toEqual([false]);

    rs.set('intervals', false);
    expect(rs.get('intervals')).toEqual([false, false]);
  });
});

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
      tooltips: true,
      intervals: [true, false],
    };
    const rs = new RangeSlider($el, options);
    expect(rs.getAll()).toEqual({
      value: [50],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'horizontal',
      tooltips: [true],
      intervals: [true, false],
    });
  });
});

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
      tooltips: true,
      intervals: [true, false],
    };
    const rs = new RangeSlider($el, options);

    const newOptions: Options = {
      value: [70, 80],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'vertical',
      tooltips: true,
      intervals: false,
    };

    rs.setAll(newOptions);

    expect(rs.getAll()).toEqual({
      value: [70, 80],
      min: 0,
      max: 100,
      step: 5,
      orientation: 'vertical',
      tooltips: [true, true],
      intervals: [false, false, false],
    });
  });
});

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
