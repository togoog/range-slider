import View from '../mvp/view';
import { State, Data } from '../types';

const cssClass = `range-slider`;
const trackCSSClass = `${cssClass}__track`;
const gridCSSClass = `${cssClass}__grid`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

const tooltipFormatter = (value: number) => value.toLocaleString();

describe('View.render', () => {
  const data: Data = {
    handles: { handle_0: 20, handle_1: 40 },
    handleIds: ['handle_0', 'handle_1'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true, tooltip_1: true },
    tooltipIds: ['tooltip_0', 'tooltip_1'],
    tooltipCollisions: [],
    tooltipFormatter,
    intervals: { interval_0: false, interval_1: true, interval_2: false },
    intervalIds: ['interval_0', 'interval_1', 'interval_2'],
    grid: { isVisible: true, numCells: [2, 3] },
  };

  const state: State = {
    cssClass,
    track: { orientation: 'horizontal', cssClass: trackCSSClass },
    intervals: [
      {
        id: 'interval_0',
        handleIds: ['first', 'handle_0'],
        from: 0,
        to: 20,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        role: 'interval',
      },
      {
        id: 'interval_1',
        handleIds: ['handle_0', 'handle_1'],
        from: 20,
        to: 40,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        role: 'interval',
      },
      {
        id: 'interval_2',
        handleIds: ['handle_1', 'last'],
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
        handleIds: ['handle_0'],
        position: 20,
        content: data.tooltipFormatter(data.handles.handle_0),
        orientation: 'horizontal',
        cssClass: tooltipCSSClass,
        isVisible: true,
        hasCollisions: false,
        role: 'tooltip',
      },
      {
        id: 'tooltip_1',
        handleIds: ['handle_1'],
        position: 40,
        content: data.tooltipFormatter(data.handles.handle_1),
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
      numCells: [2, 3],
      orientation: 'horizontal',
      min: data.min,
      max: data.max,
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
