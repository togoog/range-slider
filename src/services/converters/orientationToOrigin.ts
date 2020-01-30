import { Orientation, Origin } from '../../types';

function convertOrientationToOrigin(orientation: Orientation): Origin {
  return orientation === 'horizontal' ? 'left' : 'bottom';
}

export default convertOrientationToOrigin;
