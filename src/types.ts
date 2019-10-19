export type Plugin = {
  get<K extends OptionsKey>(key: K): Options[K];
  set<K extends OptionsKey>(key: K, value: Options[K]): Plugin;
};

//
// ─── OPTIONS ────────────────────────────────────────────────────────────────────
//

export type Options = {
  value: number | number[];
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  tooltips: boolean | boolean[];
  intervals: boolean | boolean[];
};

export type OptionsKey = keyof Options;

//
// ─── MODEL ──────────────────────────────────────────────────────────────────────
//

export type Model = {
  get<K extends DataKey>(key: K): Data[K];
  set<K extends DataKey>(key: K, value: Data[K]): Model;
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
  min: number;
  max: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
  tooltips: boolean[];
  intervals: boolean[];
};

export type DataKey = keyof Data;

export type Proposal = {
  [key in keyof Data]: (data: Data) => Data[key];
};

//
// ─── STATE ──────────────────────────────────────────────────────────────────────
//

export type Position = {
  // PositionId === SpotId
  id: ValueId;
  // relative position of value in from the beginning of range-slider (in %)
  value: number;
};

export type Origin = 'left' | 'right' | 'top' | 'bottom';

export type Handle = {
  origin: Origin;
  position: Position;
};

export type Tooltip = {
  origin: Origin;
  position: Position;
  content: string;
  isVisible: boolean;
};

export type Interval = {
  origin: Origin;
  from: Position;
  to: Position;
  isVisible: boolean;
};

// State is a data prepared for view rendering
export type State = {
  handles: Handle[];
  tooltips: Tooltip[];
  intervals: Interval[];
};

//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export type View = {
  render(state: State): void;
};
