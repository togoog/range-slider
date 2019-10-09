import { intervalView, trackView } from '../components';

const className = 'range-slider';

class View implements RangeSliderView {
  constructor(private el: HTMLElement, private actions: RangeSliderActions) {}

  render({ interval }: RangeSliderState): void {
    this.el.outerHTML = `
      <div class="${className}">
        ${trackView()}
        ${intervalView(interval)}
      </div>
    `;
  }
}

export { View, className };
