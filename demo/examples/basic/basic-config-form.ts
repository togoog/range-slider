import { Config } from '../../types';
import {
  configForm,
  controlValue,
  controlMin,
  controlMax,
  controlStep,
  controlOrientation,
  controlTooltips,
  controlTooltipFormatter,
  controlIntervals,
  controlGrid,
} from '../../components';

function basicConfigForm(config: Config) {
  return configForm(config, [
    controlValue,
    controlMin,
    controlMax,
    controlStep,
    controlOrientation,
    controlTooltips,
    controlTooltipFormatter,
    controlIntervals,
    controlGrid,
  ]);
}

export default basicConfigForm;
