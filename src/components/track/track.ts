import { CSSClasses } from '../../types';

export interface TrackOptions {
  cssClasses?: CSSClasses;
}

export interface Track {}

const defaultOptions: TrackOptions = {
  cssClasses: {
    track: 'track',
  },
};
