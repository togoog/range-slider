import { View } from '../mvp/view';
import { State, Data } from '../types';
import { fireEvent } from '@testing-library/dom';

const cssPrefix = 'curly';
const cssClass = `${cssPrefix}-range-slider`;
const trackCSSClass = `${cssClass}__track`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

const tooltipsFormatter = (value: number) => value.toLocaleString();

describe('View.render', () => {
  const data: Data = {
    spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    tooltips: [true, true],
    tooltipCollisions: [],
    tooltipFormatter: tooltipsFormatter,
    intervals: [false, true, false],
  };

  const state: State = {
    cssClass,
    track: { orientation: 'horizontal', cssClass: trackCSSClass },
    intervals: [
      {
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        from: { id: 'first', value: 0 },
        to: { id: 'value_0', value: 20 },
      },
      {
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        from: { id: 'value_0', value: 20 },
        to: { id: 'value_1', value: 40 },
      },
      {
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        from: { id: 'value_1', value: 40 },
        to: { id: 'last', value: 100 },
      },
    ],
    handles: [
      {
        cssClass: handleCSSClass,
        orientation: 'horizontal',
        position: { id: 'value_0', value: 20 },
        isActive: false,
      },
      {
        cssClass: handleCSSClass,
        orientation: 'horizontal',
        position: { id: 'value_1', value: 40 },
        isActive: false,
      },
    ],
    tooltips: [
      {
        cssClass: tooltipCSSClass,
        orientation: 'horizontal',
        content: data.tooltipFormatter(data.spots[0].value),
        isVisible: true,
        hasCollisions: false,
        position: { id: 'value_0', value: 20 },
      },
      {
        cssClass: tooltipCSSClass,
        orientation: 'horizontal',
        content: data.tooltipFormatter(data.spots[1].value),
        isVisible: true,
        hasCollisions: false,
        position: { id: 'value_1', value: 40 },
      },
    ],
  };

  test('should render track', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $interval = document.getElementsByClassName(state.track.cssClass);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(state.track.cssClass);
    expect($interval).toHaveLength(1);
  });

  test('should only render intervals with isVisible = true', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $interval = document.getElementsByClassName(
      state.intervals[0].cssClass,
    );
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(state.intervals[0].cssClass);
    expect($interval).toHaveLength(1);
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
    const $interval = document.getElementsByClassName(intervalCSSClass)[0];
    const style = ($interval as HTMLElement).style;
    const left = style.getPropertyValue('left');
    const width = style.getPropertyValue('width');
    expect(left).toBe('20%');
    expect(width).toBe('20%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
    const data: Data = {
      spots: [{ id: 'value_0', value: 20 }, { id: 'value_1', value: 40 }],
      activeSpotIds: [],
      min: 0,
      max: 100,
      step: 1,
      orientation: 'vertical',
      intervals: [false, true, false],
      tooltipCollisions: [],
      tooltipFormatter: tooltipsFormatter,
      tooltips: [true, true],
    };

    const state: State = {
      cssClass,
      track: { orientation: 'vertical', cssClass: trackCSSClass },
      intervals: [
        {
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 20 },
        },
        {
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: true,
          from: { id: 'value_0', value: 20 },
          to: { id: 'value_1', value: 40 },
        },
        {
          cssClass: intervalCSSClass,
          orientation: 'vertical',
          isVisible: false,
          from: { id: 'value_1', value: 40 },
          to: { id: 'last', value: 100 },
        },
      ],
      handles: [
        {
          cssClass: handleCSSClass,
          orientation: 'vertical',
          position: { id: 'value_0', value: 20 },
          isActive: false,
        },
        {
          cssClass: handleCSSClass,
          orientation: 'vertical',
          position: { id: 'value_1', value: 40 },
          isActive: false,
        },
      ],
      tooltips: [
        {
          cssClass: tooltipCSSClass,
          orientation: 'vertical',
          content: data.tooltipFormatter(data.spots[0].value),
          isVisible: true,
          hasCollisions: false,
          position: { id: 'value_0', value: 20 },
        },
        {
          cssClass: tooltipCSSClass,
          orientation: 'vertical',
          content: data.tooltipFormatter(data.spots[1].value),
          isVisible: true,
          hasCollisions: false,
          position: { id: 'value_1', value: 40 },
        },
      ],
    };

    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $interval = document.getElementsByClassName(intervalCSSClass)[0];
    const style = ($interval as HTMLElement).style;
    const bottom = style.getPropertyValue('bottom');
    const height = style.getPropertyValue('height');
    expect(bottom).toBe('20%');
    expect(height).toBe('20%');
  });
});

describe('Handle', () => {
  const data: Data = {
    spots: [{ id: 'value_0', value: 50 }],
    activeSpotIds: [],
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    tooltips: [true],
    tooltipCollisions: [],
    tooltipFormatter: tooltipsFormatter,
    intervals: [true, false],
  };

  const state: State = {
    cssClass,
    track: { orientation: 'horizontal', cssClass: trackCSSClass },
    intervals: [
      {
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        from: { id: 'first', value: 0 },
        to: { id: 'value_0', value: 50 },
      },
      {
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: false,
        from: { id: 'value_0', value: 50 },
        to: { id: 'last', value: 100 },
      },
    ],
    handles: [
      {
        cssClass: handleCSSClass,
        orientation: 'horizontal',
        position: { id: 'value_0', value: 50 },
        isActive: false,
      },
    ],
    tooltips: [
      {
        cssClass: tooltipCSSClass,
        orientation: 'horizontal',
        content: data.tooltipFormatter(data.spots[0].value),
        isVisible: true,
        hasCollisions: false,
        position: { id: 'value_0', value: 500 },
      },
    ],
  };

  test(`View should emit ${View.EVENT_HANDLE_DRAG_START} on Handle mouseDown`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragStartListener = jest.fn();
    view.on(View.EVENT_HANDLE_DRAG_START, dragStartListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      state.handles[0].cssClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    expect(dragStartListener).toBeCalledTimes(1);
    expect(dragStartListener).toBeCalledWith({
      id: 'value_0',
      value: 50,
    });
  });

  test(`View should emit ${View.EVENT_HANDLE_DRAG_END} on Handle mouseUp`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragEndListener = jest.fn();
    view.on(View.EVENT_HANDLE_DRAG_END, dragEndListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      state.handles[0].cssClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    fireEvent.mouseUp($handle);
    expect(dragEndListener).toBeCalledTimes(1);
  });

  test(`View should emit ${View.EVENT_HANDLE_DRAG} on Handle move`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const dragListener = jest.fn();
    view.on(View.EVENT_HANDLE_DRAG, dragListener);
    view.render(state);
    const $handle = document.getElementsByClassName(
      state.handles[0].cssClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown($handle);
    fireEvent.mouseMove($handle, { clientX: 100 });
    expect(dragListener).toBeCalledTimes(1);
  });
});
