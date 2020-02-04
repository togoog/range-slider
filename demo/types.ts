import { TemplateResult } from 'lit-html';

import { Options } from '../src/types';

export type OptionsProposal = (options: Options) => Options;

export type OnConfigFormUpdate = (proposal: OptionsProposal) => void;

export type Config = {
  options: Options;
  onUpdate: OnConfigFormUpdate;
};

export type ElementAttributes = {
  type: string;
  valueFormatter: (value: number) => string;
  valueParser: (value: string) => number;
};

export type ConfigFormElement = (...args: unknown[]) => TemplateResult;
