import { CSSClasses } from '../../types';

export interface IntervalOptions {
  isVisible: boolean;
  isDraggable?: boolean;
  isDisabled?: boolean;
  minLength?: number;
  maxLength?: number;
  cssClasses?: CSSClasses;
}

export interface Interval {}

const defaultOptions: IntervalOptions = {
  isVisible: false,
  cssClasses: {
    interval: 'interval',
  },
};
