import { render } from 'lit-html';
import { Options } from '../../src/types';
import { Config, OnConfigFormUpdate } from '../types';
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
} from '../components';

function makeConfigForm(config: Config) {
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

function renderConfigForm(
  options: Options,
  onUpdate: OnConfigFormUpdate,
  container: Element,
) {
  render(makeConfigForm({ options, onUpdate }), container);
}

export default makeConfigForm;
