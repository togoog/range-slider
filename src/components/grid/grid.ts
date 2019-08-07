import { CSSClasses } from '../../types';

export interface GridOptions {
  isVisible?: boolean; // Enables grid of values.
  formatter?: Function; // for labels
  generator?: Function; // for pips
  cssClasses?: CSSClasses;
}

export interface Grid {}

const defaultOptions: GridOptions = {
  cssClasses: {
    grid: 'grid',
    pips: 'pips',
  },
};
