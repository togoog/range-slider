import { State } from '../../types';
import { View } from '../../mvp';

const cssClass = `range-slider`;
const trackCSSClass = `${cssClass}__track`;
const intervalCSSClass = `${cssClass}__interval`;
const handleCSSClass = `${cssClass}__handle`;
const tooltipCSSClass = `${cssClass}__tooltip`;

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
      content: '20',
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
    numCells: [2, 3],
    orientation: 'horizontal',
    min: 0,
    max: 100,
  },
};
describe('Interval', () => {
  test('interval should be hidden if isVisible = false', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    let $intervals = document.getElementsByClassName(intervalCSSClass);
    expect($intervals).toHaveLength(0);
    view.render(state);
    $intervals = document.getElementsByClassName(intervalCSSClass);
    expect($intervals).toHaveLength(1);
    expect(window.getComputedStyle($intervals[0]).display).toBe('block');
  });

  test('should position interval relative to beginning of track (horizontal)', () => {
    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $intervals = document.getElementsByClassName(intervalCSSClass);
    expect(window.getComputedStyle($intervals[0]).left).toBe('20%');
    expect(window.getComputedStyle($intervals[0]).width).toBe('20%');
  });

  test('should position interval relative to beginning of track (vertical)', () => {
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
          content: '20',
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
          content: '40',
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
        min: 0,
        max: 100,
      },
    };

    document.body.innerHTML = '<div id="root"></div>';
    const $el = document.querySelector('#root');
    const view = new View($el as HTMLElement);
    view.render(state);
    const $intervals = document.getElementsByClassName(intervalCSSClass);
    expect(window.getComputedStyle($intervals[0]).bottom).toBe('20%');
    expect(window.getComputedStyle($intervals[0]).height).toBe('20%');
  });
});
