import { clone } from 'ramda';
import { View, className as rsClassName } from '../mvp/view';
import {
  trackClassName,
  handleClassName,
  intervalClassName,
  tooltipClassName,
} from '../components';

describe('View.render', () => {
  const state: RangeSliderState = {
    interval: {
      beginning: 'left',
      from: 20,
      to: 40,
      handles: [
        {
          isVisible: true,
          tooltip: {
            content: '20',
          },
        },
        {
          isVisible: true,
          tooltip: {
            content: '40',
          },
        },
      ],
    },
  };
  const actions: RangeSliderActions = {};

  test('should render track', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    let $interval = document.getElementsByClassName(trackClassName);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(trackClassName);
    expect($interval).toHaveLength(1);
  });

  test('should render interval', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    let $interval = document.getElementsByClassName(intervalClassName);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(intervalClassName);
    expect($interval).toHaveLength(1);
  });

  test('should render handles', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    expect(document.getElementsByClassName(rsClassName).length).toBe(0);
    expect(document.getElementsByClassName(handleClassName).length).toBe(0);
    view.render(state);
    expect(document.getElementsByClassName(rsClassName).length).toBe(1);
    expect(document.getElementsByClassName(handleClassName).length).toBe(2);
  });

  test('should render tooltips', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    let $tooltips = document.getElementsByClassName(tooltipClassName);
    expect($tooltips.length).toBe(0);
    view.render(state);
    $tooltips = document.getElementsByClassName(tooltipClassName);
    expect($tooltips.length).toBe(2);
    expect($tooltips[0].innerHTML).toMatch('20');
    expect($tooltips[1].innerHTML).toMatch('40');
  });

  test('should position interval relative to beginning of track (horizontal)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    view.render(state);
    const $interval = document.getElementsByClassName(intervalClassName)[0];
    const style = ($interval as HTMLElement).style;
    const left = style.getPropertyValue('left');
    const width = style.getPropertyValue('width');
    expect(left).toBe('20%');
    expect(width).toBe('20%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    const stateVertical = clone(state);
    stateVertical.interval.beginning = 'bottom';
    view.render(stateVertical);
    const $interval = document.getElementsByClassName(intervalClassName)[0];
    const style = ($interval as HTMLElement).style;
    const bottom = style.getPropertyValue('bottom');
    const height = style.getPropertyValue('height');
    expect(bottom).toBe('20%');
    expect(height).toBe('20%');
  });

  test('handle should be hidden if handle.isVisible is false', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    const stateHandleHidden = clone(state);
    stateHandleHidden.interval.handles[0].isVisible = false;
    view.render(stateHandleHidden);
    const $handles = document.getElementsByClassName(handleClassName);
    const $firstHandle = $handles[0] as HTMLElement;
    expect($handles.length).toBe(2);
    expect($firstHandle.style.display).toBe('none');
  });

  test('should display only 1 handle for single value', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement, actions);
    const stateSingleValue = clone(state);
    stateSingleValue.interval.from = 40;
    stateSingleValue.interval.to = 40;
    stateSingleValue.interval.handles[0].isVisible = false;
    view.render(stateSingleValue);
    const $handles = document.getElementsByClassName(handleClassName);
    const $interval = document.getElementsByClassName(
      intervalClassName,
    )[0] as HTMLElement;
    const $firstHandle = $handles[0] as HTMLElement;
    const $secondHandle = $handles[1] as HTMLElement;
    expect($handles.length).toBe(2);
    expect($firstHandle.style.display).toBe('none');
    expect($secondHandle.style.display).toBe('block');
    expect($interval.style.left).toBe('40%');
    expect($interval.style.width).toBe('0%');
  });
});
