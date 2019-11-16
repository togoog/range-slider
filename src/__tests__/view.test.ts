import { fireEvent } from '@testing-library/dom';
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

  test('interval should be hidden if isVisible = false', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $intervals = document.getElementsByClassName(intervalCSSClass);
    expect($intervals).toHaveLength(0);
    view.render(state);
    $intervals = document.getElementsByClassName(intervalCSSClass);
    expect($intervals).toHaveLength(3);
    expect(window.getComputedStyle($intervals[0]).display).toBe('none');
    expect(window.getComputedStyle($intervals[1]).display).toBe('block');
    expect(window.getComputedStyle($intervals[2]).display).toBe('none');
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

  test('should position interval relative to beginning of track (horizontal)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $intervals = document.getElementsByClassName(intervalCSSClass);
    expect(window.getComputedStyle($intervals[0]).left).toBe('0%');
    expect(window.getComputedStyle($intervals[0]).width).toBe('20%');
    expect(window.getComputedStyle($intervals[1]).left).toBe('20%');
    expect(window.getComputedStyle($intervals[1]).width).toBe('20%');
    expect(window.getComputedStyle($intervals[2]).left).toBe('40%');
    expect(window.getComputedStyle($intervals[2]).width).toBe('60%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
    // eslint-disable-next-line no-shadow
    const data: Data = {
      handles: { handle_0: 20, handle_1: 40 },
      handleIds: ['handle_0', 'handle_1'],
      activeHandleId: null,
      min: 0,
      max: 100,
      step: 1,
      orientation: 'vertical',
      cssClass,
      intervals: { interval_0: false, interval_1: true, interval_2: false },
      intervalIds: ['interval_0', 'interval_1', 'interval_2'],
      tooltips: { tooltip_0: true, tooltip_1: true },
      tooltipIds: ['tooltip_0', 'tooltip_1'],
      tooltipCollisions: [],
      tooltipFormatter,
      grid: { isVisible: false, numCells: [4, 5] },
    };

    // eslint-disable-next-line no-shadow
    const state: State = {
      cssClass,
      track: { orientation: 'vertical', cssClass: trackCSSClass },
      intervals: [
        {
          id: 'interval_0',
          handleIds: ['first', 'handle_0'],
          from: 0,
          to: 20,
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: false,
          role: 'interval',
        },
        {
          id: 'interval_1',
          handleIds: ['handle_0', 'handle_1'],
          from: 20,
          to: 40,
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: true,
          role: 'interval',
        },
        {
          id: 'interval_2',
          handleIds: ['handle_1', 'last'],
          from: 40,
          to: 100,
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: false,
          role: 'interval',
        },
      ],
      handles: [
        {
          id: 'handle_0',
          position: 20,
          cssClass: handleCSSClass,
          orientation: 'vertical',
          isActive: false,
          role: 'handle',
        },
        {
          id: 'handle_1',
          position: 40,
          cssClass: handleCSSClass,
          orientation: 'vertical',
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
          orientation: 'vertical',
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
          orientation: 'vertical',
          cssClass: tooltipCSSClass,
          isVisible: true,
          hasCollisions: false,
          role: 'tooltip',
        },
      ],
      grid: {
        cssClass: 'range-slider__grid',
        orientation: 'vertical',
        isVisible: false,
        numCells: [3, 4],
        min: data.min,
        max: data.max,
      },
    };

    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $intervals = document.getElementsByClassName(intervalCSSClass);
    expect(window.getComputedStyle($intervals[0]).bottom).toBe('0%');
    expect(window.getComputedStyle($intervals[0]).height).toBe('20%');
    expect(window.getComputedStyle($intervals[1]).bottom).toBe('20%');
    expect(window.getComputedStyle($intervals[1]).height).toBe('20%');
    expect(window.getComputedStyle($intervals[2]).bottom).toBe('40%');
    expect(window.getComputedStyle($intervals[2]).height).toBe('60%');
  });
});

describe('Handle', () => {
  const data: Data = {
    handles: { handle_0: 50 },
    handleIds: ['handle_0'],
    activeHandleId: null,
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    cssClass: 'range-slider',
    tooltips: { tooltip_0: true },
    tooltipIds: ['tooltip_0'],
    tooltipCollisions: [],
    tooltipFormatter,
    intervals: { interval_0: true, interval_1: false },
    intervalIds: ['interval_0', 'interval_1'],
    grid: { isVisible: false, numCells: [3, 4] },
  };

  const state: State = {
    cssClass,
    track: { orientation: 'horizontal', cssClass: trackCSSClass },
    intervals: [
      {
        id: 'interval_0',
        handleIds: ['first', 'handle_0'],
        from: 0,
        to: 50,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        role: 'interval',
      },
      {
        id: 'interval_1',
        handleIds: ['handle_0', 'last'],
        from: 50,
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
        position: 50,
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
        position: 50,
        content: data.tooltipFormatter(data.handles.handle_0),
        cssClass: tooltipCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        hasCollisions: false,
        role: 'tooltip',
      },
    ],
    grid: {
      cssClass: 'range-slider__grid',
      orientation: 'vertical',
      isVisible: false,
      numCells: [3, 4],
      min: data.min,
      max: data.max,
    },
  };

  test(`View should emit ${View.EVENT_HANDLE_MOVE_START} on Handle mouseDown`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragStartListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE_START, dragStartListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    expect(dragStartListener).toBeCalledTimes(1);
    expect(dragStartListener).toBeCalledWith('handle_0');
  });

  test(`View should emit ${View.EVENT_HANDLE_MOVE_END} on Handle mouseUp`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragEndListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE_END, dragEndListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    fireEvent.mouseUp($handle);
    expect(dragEndListener).toBeCalledTimes(1);
  });

  test(`View should emit ${View.EVENT_HANDLE_MOVE} on Handle move`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE, dragListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    fireEvent.mouseMove($handle, { clientX: 100 });
    expect(dragListener).toBeCalledTimes(1);
  });
});
