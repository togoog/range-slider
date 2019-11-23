import { createRangeSlider } from '../range-slider';

describe('createRangeSlider', () => {
  test('should create RangeSliders from valid css selector', () => {
    document.body.innerHTML = '<div id="root"></div>';
    let rsList = createRangeSlider('#root');
    expect(rsList).toHaveLength(1);

    document.body.innerHTML =
      '<div class="rs"></div> <div class="rs"></div> <div class="rs"></div>';
    rsList = createRangeSlider('.rs');
    expect(rsList).toHaveLength(3);
  });

  test('should create RangeSliders from HTMLCollectionOf<HTMLElement>', () => {
    document.body.innerHTML =
      '<div class="rs"></div> <div class="rs"></div> <div class="rs"></div>';
    const elements = document.getElementsByClassName('rs');
    const rsList = createRangeSlider(Array.from(elements) as HTMLElement[]);
    expect(rsList).toHaveLength(3);
  });

  test('should create RangeSlider from HTMLElement', () => {
    document.body.innerHTML = '<div class="rs"></div>';
    const element = document.getElementsByClassName('rs')[0];
    const rsList = createRangeSlider(element as HTMLElement);
    expect(rsList).toHaveLength(1);
  });
});
