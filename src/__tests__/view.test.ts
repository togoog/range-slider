import { clone } from 'ramda';
import { View } from '../mvp/view';
import { State } from '../types';
import { fireEvent } from '@testing-library/dom';

describe('View.render', () => {
  const state: State = {
    cssClass: 'range-slider',
    track: { cssClass: 'range-slider__track' },
    intervals: [
      {
        cssClass: 'range-slider__interval',
        origin: 'left',
        isVisible: false,
        from: { id: 'first', value: 0 },
        to: { id: 'value_0', value: 20 },
      },
      {
        cssClass: 'range-slider__interval',
        origin: 'left',
        isVisible: true,
        from: { id: 'value_0', value: 20 },
        to: { id: 'value_1', value: 40 },
      },
      {
        cssClass: 'range-slider__interval',
        origin: 'left',
        isVisible: false,
        from: { id: 'value_1', value: 40 },
        to: { id: 'last', value: 100 },
      },
    ],
    handles: [
      {
        cssClass: 'range-slider__handle',
        origin: 'left',
        position: { id: 'value_0', value: 20 },
        isActive: false,
      },
      {
        cssClass: 'range-slider__handle',
        origin: 'left',
        position: { id: 'value_1', value: 40 },
        isActive: false,
      },
    ],
    tooltips: [
      {
        cssClass: 'range-slider__tooltip',
        origin: 'left',
        content: '250',
        isVisible: true,
        position: { id: 'value_0', value: 20 },
      },
      {
        cssClass: 'range-slider__tooltip',
        origin: 'left',
        content: '450',
        isVisible: true,
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

  test('should render interval', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $interval = document.getElementsByClassName(
      state.intervals[0].cssClass,
    );
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(state.intervals[0].cssClass);
    expect($interval).toHaveLength(3);
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
    expect($tooltips[0].innerHTML).toMatch('250');
    expect($tooltips[1].innerHTML).toMatch('450');
  });

  test('should position interval relative to beginning of track (horizontal)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $interval = document.getElementsByClassName(
      state.intervals[0].cssClass,
    )[1];
    const style = ($interval as HTMLElement).style;
    const left = style.getPropertyValue('left');
    const width = style.getPropertyValue('width');
    expect(left).toBe('20%');
    expect(width).toBe('20%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
    const state: State = {
      cssClass: 'range-slider',
      track: { cssClass: 'range-slider__track' },
      intervals: [
        {
          cssClass: 'range-slider__interval',
          origin: 'bottom',
          isVisible: false,
          from: { id: 'first', value: 0 },
          to: { id: 'value_0', value: 20 },
        },
        {
          cssClass: 'range-slider__interval',
          origin: 'bottom',
          isVisible: true,
          from: { id: 'value_0', value: 20 },
          to: { id: 'value_1', value: 40 },
        },
        {
          cssClass: 'range-slider__interval',
          origin: 'bottom',
          isVisible: false,
          from: { id: 'value_1', value: 40 },
          to: { id: 'last', value: 100 },
        },
      ],
      handles: [
        {
          cssClass: 'range-slider__handle',
          origin: 'bottom',
          position: { id: 'value_0', value: 20 },
          isActive: false,
        },
        {
          cssClass: 'range-slider__handle',
          origin: 'bottom',
          position: { id: 'value_1', value: 40 },
          isActive: false,
        },
      ],
      tooltips: [
        {
          cssClass: 'range-slider__tooltip',
          origin: 'bottom',
          content: '250',
          isVisible: true,
          position: { id: 'value_0', value: 20 },
        },
        {
          cssClass: 'range-slider__tooltip',
          origin: 'bottom',
          content: '450',
          isVisible: true,
          position: { id: 'value_1', value: 40 },
        },
      ],
    };

    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    const stateVertical = clone(state);
    view.render(stateVertical);
    const $interval = document.getElementsByClassName(
      state.intervals[0].cssClass,
    )[1];
    const style = ($interval as HTMLElement).style;
    const bottom = style.getPropertyValue('bottom');
    const height = style.getPropertyValue('height');
    expect(bottom).toBe('20%');
    expect(height).toBe('20%');
  });
});

describe('Handle', () => {
  const state: State = {
    cssClass: 'range-slider',
    track: { cssClass: 'range-slider__track' },
    intervals: [
      {
        cssClass: 'range-slider__interval',
        origin: 'left',
        isVisible: true,
        from: { id: 'first', value: 0 },
        to: { id: 'value_0', value: 50 },
      },
      {
        cssClass: 'range-slider__interval',
        origin: 'left',
        isVisible: false,
        from: { id: 'value_0', value: 50 },
        to: { id: 'last', value: 100 },
      },
    ],
    handles: [
      {
        cssClass: 'range-slider__handle',
        origin: 'left',
        position: { id: 'value_0', value: 50 },
        isActive: false,
      },
    ],
    tooltips: [
      {
        cssClass: 'range-slider__tooltip',
        origin: 'left',
        content: '250',
        isVisible: true,
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
