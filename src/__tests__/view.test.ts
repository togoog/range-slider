import { clone } from 'ramda';
import { View } from '../mvp/view';
import { State } from '../types';
import {
  trackClassName,
  handleClassName,
  intervalClassName,
  tooltipClassName,
} from '../components';

describe('View.render', () => {
  const state: State = {
    intervals: [
      {
        origin: 'left',
        isVisible: true,
        from: { id: 'value_0', value: 20 },
        to: { id: 'value_1', value: 40 },
      },
    ],
    handles: [
      {
        origin: 'left',
        position: { id: 'value_0', value: 20 },
      },
      {
        origin: 'left',
        position: { id: 'value_1', value: 40 },
      },
    ],
    tooltips: [
      {
        origin: 'left',
        content: '250',
        isVisible: true,
        position: { id: 'value_0', value: 20 },
      },
      {
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
    let $interval = document.getElementsByClassName(trackClassName);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(trackClassName);
    expect($interval).toHaveLength(1);
  });

  test('should render interval', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $interval = document.getElementsByClassName(intervalClassName);
    expect($interval).toHaveLength(0);
    view.render(state);
    $interval = document.getElementsByClassName(intervalClassName);
    expect($interval).toHaveLength(1);
  });

  test('should render handles', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    expect(document.getElementsByClassName(View.cssClass).length).toBe(0);
    expect(document.getElementsByClassName(handleClassName).length).toBe(0);
    view.render(state);
    expect(document.getElementsByClassName(View.cssClass).length).toBe(1);
    expect(document.getElementsByClassName(handleClassName).length).toBe(2);
  });

  test('should render tooltips', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $tooltips = document.getElementsByClassName(tooltipClassName);
    expect($tooltips.length).toBe(0);
    view.render(state);
    $tooltips = document.getElementsByClassName(tooltipClassName);
    expect($tooltips.length).toBe(2);
    expect($tooltips[0].innerHTML).toMatch('250');
    expect($tooltips[1].innerHTML).toMatch('450');
  });

  test('should position interval relative to beginning of track (horizontal)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $interval = document.getElementsByClassName(intervalClassName)[0];
    const style = ($interval as HTMLElement).style;
    const left = style.getPropertyValue('left');
    const width = style.getPropertyValue('width');
    expect(left).toBe('20%');
    expect(width).toBe('20%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
    const state: State = {
      intervals: [
        {
          origin: 'bottom',
          isVisible: true,
          from: { id: 'value_0', value: 20 },
          to: { id: 'value_1', value: 40 },
        },
      ],
      handles: [
        {
          origin: 'bottom',
          position: { id: 'value_0', value: 20 },
        },
        {
          origin: 'bottom',
          position: { id: 'value_1', value: 40 },
        },
      ],
      tooltips: [
        {
          origin: 'bottom',
          content: '250',
          isVisible: true,
          position: { id: 'value_0', value: 20 },
        },
        {
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
    const $interval = document.getElementsByClassName(intervalClassName)[0];
    const style = ($interval as HTMLElement).style;
    const bottom = style.getPropertyValue('bottom');
    const height = style.getPropertyValue('height');
    expect(bottom).toBe('20%');
    expect(height).toBe('20%');
  });
});
