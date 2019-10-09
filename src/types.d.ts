type RangeSliderPlugin = {
  get<K extends OptionsKey>(key: K): RangeSliderOptions[K];
  set<K extends OptionsKey>(
    key: K,
    value: RangeSliderOptions[K],
  ): RangeSliderPlugin;
};

//
// ─── OPTIONS ────────────────────────────────────────────────────────────────────
//

type RangeSliderOptions = {
  value: number[];
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  tooltips: boolean[];
};

type OptionsKey = keyof RangeSliderOptions;

//
// ─── MODEL ──────────────────────────────────────────────────────────────────────
//

type RangeSliderModel = {
  get<K extends ModelDataKey>(key: K): ModelData[K];
  set<K extends ModelDataKey>(key: K, value: ModelData[K]): RangeSliderModel;
  propose(change: Partial<ModelProposal>): void;
};

type ModelData = RangeSliderOptions;

type ModelDataKey = keyof ModelData;

type ModelProposal = {
  [key in keyof ModelData]: (data: ModelData) => ModelData[key];
};

//
// ─── STATE ──────────────────────────────────────────────────────────────────────
//

type HandleState = {
  isVisible: boolean;
  tooltip?: TooltipState;
};

type TooltipState = {
  content: string;
};

type IntervalState = {
  // depends on orientation
  beginning: 'left' | 'right' | 'top' | 'bottom';
  // relative (%) position from the beginning of track for interval starting point
  from: number;
  // relative (%) position from the beginning of track for interval ending point
  to: number;
  handles: [HandleState, HandleState];
};

type RangeSliderState = {
  interval: IntervalState;
};

//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

interface RangeSliderView {
  render(state: RangeSliderState): void;
}

//
// ─── ACTIONS ────────────────────────────────────────────────────────────────────
//

type RangeSliderActions = TrackActions & HandleActions & TooltipActions;

type TrackActions = {
  // onTrackClick:
};

type HandleActions = {};

type TooltipActions = {};
