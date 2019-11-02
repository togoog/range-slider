export type Plugin = {
  get<K extends OptionsKey>(key: K): Options[K];
  set<K extends OptionsKey>(key: K, value: Options[K]): Plugin;
  getAll(): Options;
  setAll(options: Options): void;
};

export type RangeSliderError = {
  id: string;
  desc: string;
};

// coordinate system origin
// is used to set position of absolute positioned elements
export type Origin = 'left' | 'right' | 'top' | 'bottom';

// real value user wants
export type RealValue = number;
// relative position inside range slider
export type RelativePos = number;

export type ValueId = string;
export type HandleId = string;
export type TooltipId = string;
export type IntervalId = string;

//
// ─── OPTIONS ────────────────────────────────────────────────────────────────────
//

export type Orientation = 'horizontal' | 'vertical';
export type Formatter = (value: number) => string;

export type Options = {
  value: number | number[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  tooltips: boolean | boolean[];
  tooltipFormatter: Formatter;
  intervals: boolean | boolean[];
  cssClass: string;
};

export type OptionsKey = keyof Options;

//
// ─── MODEL ──────────────────────────────────────────────────────────────────────
//

export type RangeSliderModel = {
  getAll(): Data;
  setAll(data: Data): void;
  get<K extends DataKey>(key: K): Data[K];
  set<K extends DataKey>(key: K, value: Data[K]): RangeSliderModel;
  on(eventName: string, listener: Function): void;
  propose(change: Partial<Proposal>): void;
};

export type Handle = {
  id: HandleId;
  valueId: ValueId;
  orientation: Orientation;
  position: Position;
  cssClass: string;
  isActive: boolean;
};

export type Tooltip = {
  id: TooltipId;
  valueId: ValueId[];
  orientation: Orientation;
  position: RelativePos;
  content: string;
  cssClass: string;
  isVisible: boolean;
  hasCollisions: boolean;
  role: string;
};

export type Interval = {
  id: IntervalId;
  valueId: ValueId[];
  orientation: Orientation;
  from: RelativePos;
  to: RelativePos;
  isVisible: boolean;
  cssClass: string;
  role: string;
};

export type Track = {
  orientation: Orientation;
  cssClass: string;
};

export type Data = {
  values: { [valueId: string]: RealValue };
  valueIds: ValueId[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;
  handles: { [handleId: string]: Handle };
  handleIds: HandleId[];
  tooltips: { [tooltipId: string]: Tooltip };
  tooltipIds: TooltipId[];
  tooltipFormatter: Formatter;
  // array of tooltipId groups
  // each group contain ids of overlapping tooltips
  tooltipCollisions: TooltipId[][];
  intervals: { [intervalId: string]: Interval };
  intervalIds: IntervalId[];
};

export type DataKey = keyof Data;

export type Proposal = {
  [key in keyof Data]: (data: Data) => Data[key];
};

//
// ─── STATE ──────────────────────────────────────────────────────────────────────
//

// State is a data prepared for view rendering
export type State = {
  cssClass: string;
  track: Track;
  handles: Handle[];
  tooltips: Tooltip[];
  intervals: Interval[];
};

//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export type RangeSliderView = {
  render(state: State): void;
  on(eventName: string, listener: Function): void;
};

//
// ─── PRESENTER ──────────────────────────────────────────────────────────────────
//

export type RangeSliderPresenter = {
  // start the application
  startApp(): void;
};
