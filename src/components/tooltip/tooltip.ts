import { Tooltip } from '../../types';

const className = 'range-slider__tooltip';

function tooltipView({ content }: Tooltip): string {
  return `
    <div class="${className}">
      ${content}
    </div>
  `;
}

export { tooltipView, className };
