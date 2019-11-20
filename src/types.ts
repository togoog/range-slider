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

// TODO: add props
// mode =
//  'count'         - divide track into parts according to numCells (default)
//  | 'positions'   - position tick marks at relative positions from values prop
//  | 'values'      - position tick marks at absolute positions from values prop
//
// alignToStep = boolean  - align all tick marks (pips) to nearest step position
//
// values = number[]      - relative percent values if mode = 'positions'
//                        - absolute values if mode = 'values'
// NOTE: prop names should be more organic

export type GridOptions = {
  isVisible: boolean;
  // Number of cells on each level (from biggest to smallest)
  // e.g.: [3, 4, 5] -> 3 big cells, 4 medium cells, 5 small cells
  numCells: number[];
};

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
  grid: boolean | GridOptions;
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
  grid: GridOptions;
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

export type HandleId = string;
export type HandleData = {
  id: HandleId;
  value: RealValue;
  // Handle has relation with only 1 Tooltip
  tooltipId: TooltipId;
  // Handle has relation with 2 Intervals
  lhsIntervalId: IntervalId;
  rhsIntervalId: IntervalId;
};

export type TooltipId = string;
export type TooltipData = {
  id: TooltipId;
  isVisible: boolean;
  // Tooltip has relation with only 1 Handle
  handleId: HandleId;
};

export type IntervalId = string;
export type IntervalData = {
  id: IntervalId;
  isVisible: boolean;
  // First interval does not have left Handle
  lhsHandleId: HandleId | null;
  // Last interval does not have right Handle
  rhsHandleId: HandleId | null;
};

export type Data = {
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;

  /** HANDLES */
  handleDict: { [handleId: string]: HandleData };
  handleIds: HandleId[];
  activeHandleId: HandleId | null;

  /** TOOLTIPS */
  tooltipDict: { [tooltipId: string]: TooltipData };
  tooltipIds: TooltipId[];
  tooltipFormatter: Formatter;
  // groups of overlapping tooltips
  tooltipCollisions: TooltipId[][];

  /** INTERVALS */
  intervalDict: { [intervalId: string]: IntervalData };
  intervalIds: IntervalId[];

  /** GRID */
  grid: GridOptions;
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

export type Handle = {
  id: HandleId;
  orientation: Orientation;
  position: RelativePos;
  cssClass: string;
  isActive: boolean;
  role: 'handle';
};

export type Tooltip = {
  id: TooltipId;
  orientation: Orientation;
  position: RelativePos;
  content: string;
  cssClass: string;
  isVisible: boolean;
  hasCollisions: boolean;
  role: 'tooltip' | 'tooltip-merged';
};

export type Interval = {
  id: IntervalId;
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
  role: 'track';
};

export type Grid = {
  isVisible: boolean;
  orientation: Orientation;
  cssClass: string;
  cells: GridCell[];
  min: number;
  max: number;
  role: 'grid';
};

export type GridCell = {
  label: string;
  isVisibleLabel: boolean;
  level: number;
  // relative position
  position: number;
  cssClass: string;
  orientation: Orientation;
  role: 'grid-cell';
};

// State is a model Data prepared for view rendering
export type State = {
  cssClass: string;
  track: Track;
  grid: Grid;
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
