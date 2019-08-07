import { CSSClasses } from '../../types';

export interface HandleOptions {
  value: number;
  isDraggable?: boolean;
  isDisabled?: boolean;
  respectConstrains?: boolean; // true - can't go through other handlers, false - can.
  snap?: boolean; // snap handle to grid
  cssClasses?: CSSClasses;
}

export interface Handle {}

const defaultOptions: HandleOptions = {
  value: 0,
  cssClasses: {
    handle: 'handle',
  },
};
