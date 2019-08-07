import { CSSClasses } from '../../types';

export interface TooltipOptions {
  isVisible?: boolean;
  formatter?: Function; // function for constructing label value
  cssClasses?: CSSClasses;
}

export interface Tooltip {}

const defaultOptions: TooltipOptions = {
  cssClasses: {
    tooltip: 'tooltip',
  }
}
