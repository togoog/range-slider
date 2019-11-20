import View from '../../mvp/view';
import { State } from '../../types';

const cssClass = `range-slider`;
const trackCSSClass = `${cssClass}__track`;
const gridCSSClass = `${cssClass}__grid`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

describe('View.render', () => {
  const state: State = {
    cssClass,
    track: {
      orientation: 'horizontal',
      cssClass: trackCSSClass,
      role: 'track',
    },
    intervals: [
      {
        id: 'interval_0',
        from: 0,
        to: 20,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        role: 'interval',
      },
      {
        id: 'interval_1',
        from: 20,
        to: 40,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        role: 'interval',
      },
      {
        id: 'interval_2',
        from: 40,
        to: 100,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        role: 'interval',
      },
    ],
    handles: [
      {
        id: 'handle_0',
        position: 20,
        cssClass: handleCSSClass,
        orientation: 'horizontal',
        isActive: false,
        role: 'handle',
      },
      {
        id: 'handle_1',
        position: 40,
        cssClass: handleCSSClass,
        orientation: 'horizontal',
        isActive: false,
        role: 'handle',
      },
    ],
    tooltips: [
      {
        id: 'tooltip_0',
        position: 20,
        content: '20',
        orientation: 'horizontal',
        cssClass: tooltipCSSClass,
        isVisible: true,
        hasCollisions: false,
        role: 'tooltip',
      },
      {
        id: 'tooltip_1',
        position: 40,
        content: '40',
        orientation: 'horizontal',
        cssClass: tooltipCSSClass,
        isVisible: true,
        hasCollisions: false,
        role: 'tooltip',
      },
    ],
    grid: {
      cssClass: 'range-slider__grid',
      isVisible: true,
      orientation: 'horizontal',
      min: 0,
      max: 100,
      role: 'grid',
      cells: [],
    },
  };

  test('should render track', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $interval = document.getElementsByClassName(trackCSSClass);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(trackCSSClass);
    expect($interval).toHaveLength(1);
  });

  test('should render grid', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $grid = document.getElementsByClassName(gridCSSClass);
    expect($grid).toHaveLength(0);
    view.render(state);
    $grid = document.getElementsByClassName(gridCSSClass);
    expect($grid).toHaveLength(1);
  });

  test('should render only visible intervals (with isVisible = true)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let intervals = document.getElementsByClassName(intervalCSSClass);
    expect(intervals).toHaveLength(0);
    view.render(state);
    intervals = document.getElementsByClassName(intervalCSSClass);
    expect(intervals).toHaveLength(1);
  });

  test('should render handles', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    expect(
      document.getElementsByClassName(state.handles[0].cssClass).length,
    ).toBe(0);
    view.render(state);
    expect(
      document.getElementsByClassName(state.handles[0].cssClass).length,
    ).toBe(2);
  });

  test('should render tooltips', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $tooltips = document.getElementsByClassName(state.tooltips[0].cssClass);
    expect($tooltips.length).toBe(0);
    view.render(state);
    $tooltips = document.getElementsByClassName(state.tooltips[0].cssClass);
    expect($tooltips.length).toBe(2);
  });
});
