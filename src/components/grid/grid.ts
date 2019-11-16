import { TemplateResult, html } from 'lit-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { Grid, GridCell, Orientation } from '../../types';
import cellView from './cell';

// TODO: Make it recursive to create cells inside big cell and cells inside medium cell
// eslint-disable-next-line complexity
function createCells(
  min: number,
  max: number,
  orientation: Orientation,
  cssClass: string,
  numCells: number[],
): GridCell[] {
  const rangeSize = Math.abs(max - min);
  const cells: { [position: number]: GridCell } = {};

  let totalCells = 1;
  for (let i = 0; i < numCells.length; i += 1) {
    if (numCells[i] > 0) {
      totalCells *= numCells[i];
      const cellSize = rangeSize / totalCells;
      for (let j = 0; j <= totalCells; j += 1) {
        const value = min + cellSize * j;
        const position = parseFloat(
          (((j * cellSize) / rangeSize) * 100).toFixed(2),
        );

        if (cells[position] === undefined) {
          cells[position] = {
            label: `${parseFloat(value.toFixed(2))}`,
            isVisibleLabel: i === 0,
            level: i + 1,
            orientation,
            cssClass,
            position,
          };
        }
      }
    }
  }

  return Object.keys(cells)
    .sort((a, b) => parseFloat(a) - parseFloat(b))
    .map((key: string) => cells[parseFloat(key)]);
}

function gridView({
  min,
  max,
  numCells,
  isVisible,
  cssClass,
  orientation,
}: Grid): TemplateResult {
  const styles: StyleInfo = {
    display: isVisible ? 'block' : 'none',
  };

  const cssClasses: ClassInfo = {
    [cssClass]: true,
    [`${cssClass}_${orientation}`]: true,
  };

  const cells = createCells(
    min,
    max,
    orientation,
    `${cssClass}-cell`,
    numCells,
  );

  return html`
    <div class=${classMap(cssClasses)} style=${styleMap(styles)}>
      ${cells.map(cellView)}
    </div>
  `;
}

export default gridView;
export { createCells };
