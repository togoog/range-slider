import { Interval } from '../../types';
import { handleView } from '..';

const className = 'range-slider__interval';

function intervalView({ beginning, from, to, handles }: Interval): string {
  // prettier-ignore
  const handlesHTML = handles
    .map(handle => handleView(handle))
    .join('');

  // prettier-ignore
  const dimension = 
    beginning === 'left' || beginning === 'right' 
    ? 'width' 
    : 'height';

  const style = `
    ${beginning}: ${from}%; 
    ${dimension}: ${to - from}%
  `;

  return `
    <div class="${className}" style="${style}">
      ${handlesHTML}
    </div>
  `;
}

export { intervalView, className };
