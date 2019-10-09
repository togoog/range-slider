const className = 'range-slider__tooltip';

function tooltipView({ content }: TooltipState): string {
  return `
    <div class="${className}">
      ${content}
    </div>
  `;
}

export { tooltipView, className };
