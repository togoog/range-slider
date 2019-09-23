import { isSome, isNone, fold, some } from 'fp-ts/lib/Option';
import { $, getAttributes } from '../helpers';

describe('$', () => {
  test('Should find existing elements', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = '.range-slider';
    const elements = $(selector);
    expect(isSome(elements)).toBe(true);
    expect(fold(() => 0, (v: Element[]) => v.length)(elements)).toBe(3);
  });

  test('Should return none when no elements found', () => {
    document.body.innerHTML = `
      <span>some random text ...</span>
    `;
    const selector = '.range-slider';
    const elements = $(selector);
    expect(isNone(elements)).toBe(true);
  });

  test('Should return none if selector is not valid', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = `..range-slider`;
    const getElements = () => $(selector);
    expect(getElements).not.toThrow();
    expect(isNone(getElements())).toBe(true);
  });

  test('Should return none if selector is empty string', () => {
    document.body.innerHTML = `
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
      <input type="range" class="range-slider" />
    `;
    const selector = '';
    const getElements = () => $(selector);
    expect(getElements).not.toThrow();
    expect(isNone(getElements())).toBe(true);
  });
});

describe('getAttributes', () => {
  test('Should return empty object when no attributes set on element', () => {
    document.body.innerHTML = '<input type="range" id="range-slider" />';
    const el = document.getElementById('range-slider');
    const attributes = el && getAttributes(el);
    expect(attributes).toEqual(some({}));
  });

  test('Should return Option<RangeSliderAttributes> if attributes are set', () => {
    document.body.innerHTML = `
      <input type="range"
             id="range-slider"
             value="50"
             min="10"
             max="100"
             step="5"
             data-orientation="vertical"
             data-direction="rtl"
             data-locale="ru-RU"
             data-padding="3"
             data-is-disabled="false"
             data-is-polyfill="false"
             data-css-prefix="rs"
             data-css-classes="{'container': 'ctr', 'isHorizontal': 'hor', 'isVertical': 'ver'}"
             data-handles="null"
             data-tooltips="false"
             data-intervals="false"
             data-grid="true" />
    `;
    const el = document.getElementById('range-slider');
    const attributes = el && getAttributes(el);
    expect(attributes).toEqual(
      some({
        value: '50',
        min: '10',
        max: '100',
        step: '5',
        orientation: 'vertical',
        direction: 'rtl',
        locale: 'ru-RU',
        padding: '3',
        isDisabled: 'false',
        isPolyfill: 'false',
        cssPrefix: 'rs',
        cssClasses: `{'container': 'ctr', 'isHorizontal': 'hor', 'isVertical': 'ver'}`,
        handles: 'null',
        tooltips: 'false',
        intervals: 'false',
        grid: 'true',
      }),
    );
  });
});
