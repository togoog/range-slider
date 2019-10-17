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

export type Handle = {
  isVisible: boolean;
  tooltip?: Tooltip;
};

export type Tooltip = {
  content: string;
};

export type Interval = {
  // depends on orientation
  beginning: 'left' | 'right' | 'top' | 'bottom';
  // relative (%) position from the beginning of track for interval starting point
  from: number;
  // relative (%) position from the beginning of track for interval ending point
  to: number;
  handles: [Handle, Handle];
};

export type State = {
  interval: Interval;
};

//
// ─── VIEW ───────────────────────────────────────────────────────────────────────
//

export type View = {
  render(state: State): void;
};
