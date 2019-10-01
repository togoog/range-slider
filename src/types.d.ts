type RangeSliderOptions = {
  value: number[];
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  tooltips: boolean[];
};

type OptionsKey = keyof RangeSliderOptions;

type RangeSliderPlugin = {
  get<T extends OptionsKey>(key: T): RangeSliderOptions[T];
  set<T extends OptionsKey>(
    key: T,
    value: RangeSliderOptions[T],
  ): RangeSliderPlugin;
};

type RangeSliderModel = {
  propose(data: Partial<ModelProposal>): void;
};

type ModelData = RangeSliderOptions;

type ModelProposal = {
  [key in keyof ModelData]: (data: ModelData) => ModelData[key];
};
