import { TemplateResult } from 'lit-html';
import { Options } from '../src/types';

export type OptionsProposal = (options: Options) => Options;

export type OnConfigFormUpdate = (e: Event, proposal?: OptionsProposal) => void;

export type Config = {
  options: Options;
  onUpdate: OnConfigFormUpdate;
};

export type ConfigFormElement = (config: Config) => TemplateResult;
