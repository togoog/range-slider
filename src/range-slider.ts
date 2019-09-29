const defaultOptions: RangeSliderOptions = {
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  tooltips: true,
};

class RangeSlider implements RangeSliderPlugin {
  constructor(
    private el: string,
    private options: RangeSliderOptions = defaultOptions,
  ) {}

  get<T extends OptionsKey>(key: T): RangeSliderOptions[T] {
    return this.options[key];
  }

  set<T extends OptionsKey>(key: T, value: RangeSliderOptions[T]): RangeSlider {
    this.options[key] = value;
    return this;
  }
}

export { RangeSlider };
