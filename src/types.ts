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
  tooltipsFormatter: Formatter;
  intervals: boolean | boolean[];
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

export type ValueId = string;

export type Spot = {
  // SpotId === PositionId
  id: ValueId;
  // actual value user wants
  value: number;
};

export type Data = {
  spots: Spot[];
  activeSpotIds: ValueId[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  tooltips: boolean[];
  tooltipsFormatter: Formatter;
  intervals: boolean[];
};

export type DataKey = keyof Data;

export type Proposal = {
  [key in keyof Data]: (data: Data) => Data[key];
};

//
// ─── STATE ──────────────────────────────────────────────────────────────────────
//
export type Coordinates = {
  x: number;
  y: number;
};

export type Position = {
  // PositionId === SpotId
  id: ValueId;
  // relative position of value in from the beginning of range-slider (in %)
  value: number;
};

export type Origin = 'left' | 'right' | 'top' | 'bottom';

export type Handle = {
  orientation: Orientation;
  position: Position;
  cssClass: string;
  isActive: boolean;
};

export type Tooltip = {
  orientation: Orientation;
  position: Position;
  content: string;
  isVisible: boolean;
  cssClass: string;
};

export type Interval = {
  orientation: Orientation;
  from: Position;
  to: Position;
  isVisible: boolean;
  cssClass: string;
};

export type Track = {
  orientation: Orientation;
  cssClass: string;
};

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
