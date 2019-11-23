import { fireEvent } from '@testing-library/dom';
import { State } from '../../types';
import { View } from '../../mvp';

const cssClass = `range-slider`;
const trackCSSClass = `${cssClass}__track`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

describe('Handle', () => {
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
        to: 50,
        cssClass: intervalCSSClass,
        orientation: 'horizontal',
        isVisible: true,
        role: 'interval',
      },
      {
        id: 'interval_1',
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
        position: 50,
        content: '50',
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
      cells: [],
      min: 0,
      max: 100,
      role: 'grid',
    },
  };

  test(`View should emit ${View.EVENT_HANDLE_MOVE_START} on Handle mouseDown`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const el = document.querySelector('#root');
    const view = new View(el as HTMLElement);
    const dragStartListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE_START, dragStartListener);
    view.render(state);
    const handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown(handle);
    expect(dragStartListener).toBeCalledTimes(1);
    expect(dragStartListener).toBeCalledWith('handle_0');
  });

  test(`View should emit ${View.EVENT_HANDLE_MOVE_END} on Handle mouseUp`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const el = document.querySelector('#root');
    const view = new View(el as HTMLElement);
    const dragEndListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE_END, dragEndListener);
    view.render(state);
    const handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown(handle);
    fireEvent.mouseUp(handle);
    expect(dragEndListener).toBeCalledTimes(1);
  });

  test(`View should emit ${View.EVENT_HANDLE_MOVE} on Handle move`, () => {
    document.body.innerHTML = '<div id="root"></div>';
    const el = document.querySelector('#root');
    const view = new View(el as HTMLElement);
    const dragListener = jest.fn();
    view.on(View.EVENT_HANDLE_MOVE, dragListener);
    view.render(state);
    const handle = document.getElementsByClassName(
      handleCSSClass,
    )[0] as HTMLElement;
    fireEvent.mouseDown(handle);
    fireEvent.mouseMove(handle, { clientX: 100 });
    expect(dragListener).toBeCalledTimes(1);
  });
});
