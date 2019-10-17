import { Handle } from '../../types';
import { tooltipView } from '..';

const className = 'range-slider__handle';

function handleView({ isVisible, tooltip }: Handle): string {
  const style = `display: ${isVisible ? 'block' : 'none'}`;

  return `
    <div class="${className}" style="${style}">
      ${tooltip && tooltipView(tooltip)}
    </div>
  `;
}

export { handleView, className };
