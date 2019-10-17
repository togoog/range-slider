import { State } from '../types';
import { intervalView, trackView } from '../components';

const className = 'range-slider';

class View implements View {
  constructor(private el: HTMLElement) {}

  render({ interval }: State): void {
    this.el.outerHTML = `
      <div class="${className}">
        ${trackView()}
        ${intervalView(interval)}
      </div>
    `;
  }
}

export { View, className };
