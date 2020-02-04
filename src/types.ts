export type Plugin = {
  // get option value by key
  get<K extends OptionsKey>(key: K): Options[K];
  // get all options
  getAll(): Options;
  // pick a set of options by array of keys
  pick<K extends OptionsKey>(keys: K[]): Partial<Options>;
  // set one or many options
  set(newOptions: Partial<Options>): Plugin;
};

export type RangeSliderError = {
  id: string;
  desc: string;
};

export type Orientation = 'horizontal' | 'vertical';

//
// ─── OPTIONS ────────────────────────────────────────────────────────────────────
//

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
  // format syntax is described in src/services/formatter.ts
  tooltipFormat: string;
  intervals: boolean | boolean[];
  grid: boolean | GridOptions;
  // format syntax is described in src/services/formatter.ts
  gridFormat: string;
};

export type OptionsKey = keyof Options;

// for internal use
export type OptimizedOptions = {
  value: number[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  cssClass: string;
  tooltips: boolean[];
  tooltipFormat: string;
  intervals: boolean[];
  grid: GridOptions;
  gridFormat: string;
};

//
// ─── MODEL ──────────────────────────────────────────────────────────────────────
//

export type RangeSliderModel = {
  // get data value by key
  get<K extends DataKey>(key: K): Data[K];
  // get full data object
  getAll(): Data;
  // pick a set of keys from data
  pick<K extends DataKey>(keys: K[]): Partial<Data>;
  // set one or many values
  set(newData: Partial<Data>): RangeSliderModel;
  // bind handler to event
  on(eventName: string, listener: Function): void;
  // try to change data by evaluating proposal on data
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
  activeHandleIds: HandleId[];
  // keep track of handles stack order to make active handle always on top
  handlesStackOrder: HandleId[];

  /** TOOLTIPS */
  tooltipDict: { [tooltipId: string]: TooltipData };
  tooltipIds: TooltipId[];
  tooltipFormat: string;
  // groups of overlapping tooltips
  tooltipCollisions: TooltipId[][];

  /** INTERVALS */
  intervalDict: { [intervalId: string]: IntervalData };
  intervalIds: IntervalId[];

  /** GRID */
  grid: GridOptions;
  gridFormat: string;
};

export type DataKey = keyof Data;

// object with proposed changes to Data
// each key corresponds to Data transformation function
export type Proposal = {
  [key in DataKey]: (data: Data) => Data[key];
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
  // does this tooltip overlap with other tooltip(s)?
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
  // bind handler to event
  on(eventName: string, listener: Function): void;
};

//
// ─── PRESENTER ──────────────────────────────────────────────────────────────────
//

export type RangeSliderPresenter = {
  // start the application
  startApp(): void;
};

//
// ─── JQUERY PLUGIN TYPE ─────────────────────────────────────────────────────────
//

declare global {
  interface JQuery {
    rangeSlider(options?: Options): JQuery;
  }
}
