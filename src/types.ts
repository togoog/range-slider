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

export type Orientation = 'horizontal' | 'vertical';

//
// ─── OPTIONS ────────────────────────────────────────────────────────────────────
//

export type Formatter = (value: number) => string;

// for user convenience
export type Options = {
  value: number | number[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;
  tooltips: boolean | boolean[];
  tooltipFormatter: Formatter;
  intervals: boolean | boolean[];
};

// for internal use
export type OptimizedOptions = {
  value: number[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;
  tooltips: boolean[];
  tooltipFormatter: Formatter;
  intervals: boolean[];
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

// real value user interested in
export type RealValue = number;

export type Data = {
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;
  /** HANDLES */
  handles: { [handleId: string]: RealValue };
  handleIds: HandleId[];
  activeHandleId: HandleId | null;
  /** TOOLTIPS */
  tooltips: { [tooltipId: string]: boolean };
  tooltipIds: TooltipId[];
  tooltipFormatter: Formatter;
  tooltipCollisions: TooltipId[][]; // groups of overlapping tooltips
  /** INTERVALS */
  intervals: { [intervalId: string]: boolean };
  intervalIds: IntervalId[];
};

export type DataKey = keyof Data;

export type Proposal = {
  [key in keyof Data]: (data: Data) => Data[key];
};

//
// ─── STATE ──────────────────────────────────────────────────────────────────────
//

export type Origin = 'left' | 'right' | 'top' | 'bottom';

// relative value for display purposes
export type RelativePos = number;

export type HandleId = string;

export type Handle = {
  id: HandleId;
  orientation: Orientation;
  position: RelativePos;
  cssClass: string;
  isActive: boolean;
  role: 'handle';
};

export type TooltipId = string;

export type Tooltip = {
  id: TooltipId;
  // merged tooltip can display value of many handles
  handleIds: HandleId[];
  orientation: Orientation;
  position: RelativePos;
  content: string;
  cssClass: string;
  isVisible: boolean;
  hasCollisions: boolean;
  role: 'tooltip' | 'tooltip-merged';
};

export type IntervalId = string;

export type Interval = {
  id: IntervalId;
  // interval have only 2 handles (at the beginning & at the end)
  handleIds: [HandleId, HandleId];
  orientation: Orientation;
  from: RelativePos;
  to: RelativePos;
  cssClass: string;
  isVisible: boolean;
  role: 'interval';
};

export type Track = {
  orientation: Orientation;
  cssClass: string;
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
