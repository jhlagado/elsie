export type Atom = symbol | string | number;
export const ATOM_TYPES = ['number', 'string', 'symbol'];

export type Tuple = [string, ...any[]];
export type Expr = Tuple;

export type WildCard = 'WILD_CARD';
export const WILD_CARD: WildCard = 'WILD_CARD';

export const isString = (obj: any): obj is string =>
    Object.prototype.toString.call(obj) === "[object String]"

export const isAtom = (obj: any): obj is Atom =>
    (typeof obj) in ATOM_TYPES;

export const isTuple = (obj: any, tag?: string): obj is Tuple =>
    Array.isArray(obj) &&
    obj.length > 0 &&
    isString(obj[0]) &&
    (!tag || tag === obj[0]);

export const isExpr = (obj: any): obj is Expr =>
    isTuple(obj);

export const isWildCard = (obj: any): obj is WildCard =>
    obj === 'WILD_CARD';

export type StackObject = any;
export type HeapObject = any;

export type StateUpdate = (state: State) => State;

export interface State {
    expression: Expr;
    stack: StackObject[];
    heap: HeapObject[];
    globals: { [key: string]: number };
}

export type Rule = ['Rule', Tuple, StateUpdate];

