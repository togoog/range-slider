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
  get<K extends OptionsKey>(key: K): RangeSliderOptions[K];
  set<K extends OptionsKey>(
    key: K,
    value: RangeSliderOptions[K],
  ): RangeSliderPlugin;
};

type RangeSliderModel = {
  get<K extends ModelDataKey>(key: K): ModelData[K];
  set<K extends ModelDataKey>(key: K, value: ModelData[K]): RangeSliderModel;
  propose(data: Partial<ModelProposal>): void;
};

type ModelData = RangeSliderOptions;

type ModelDataKey = keyof ModelData;

type ModelProposal = {
  [key in keyof ModelData]: (data: ModelData) => ModelData[key];
};
